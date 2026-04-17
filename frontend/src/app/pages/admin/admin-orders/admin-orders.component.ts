// ============================================================================
// The Center — Administración de pedidos
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../models';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { AdminModalComponent } from '../../../components/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, FormsModule, AdminModalComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  statuses: OrderStatus[] = ['pendiente', 'procesando', 'enviada', 'entregada', 'cancelada'];

  modalOpen = false;
  selected: Order | null = null;
  formStatus: OrderStatus = 'pendiente';
  expandedOrderId: number | null = null;

  feedback: string | null = null;
  errorMsg: string | null = null;
  saving = false;
  pendingDelete: Order | null = null;
  deleteModalOpen = false;

  constructor(
    private orderService: OrderService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.orderService.getOrders().subscribe({
      next: (rows) => (this.orders = rows),
      error: (err) => this.setError(err)
    });
  }

  openEdit(order: Order): void {
    this.selected = order;
    this.formStatus = order.status;
    this.clearMessages();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selected = null;
  }

  onOrderModalOpen(open: boolean): void {
    this.modalOpen = open;
    if (!open) this.selected = null;
  }

  saveStatus(): void {
    if (!this.selected) return;
    this.saving = true;
    this.clearMessages();
    this.orderService.updateOrderStatus(this.selected.id, this.formStatus).subscribe({
      next: (updated) => {
        this.saving = false;
        const idx = this.orders.findIndex((o) => o.id === updated.id);
        if (idx >= 0) this.orders[idx] = updated;
        this.feedback = 'Estado del pedido actualizado.';
        this.modalOpen = false;
        this.selected = null;
      },
      error: (err) => {
        this.saving = false;
        this.setError(err);
      }
    });
  }

  toggleDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  confirmDelete(order: Order): void {
    this.pendingDelete = order;
    this.deleteModalOpen = true;
  }

  onDeleteModalChange(open: boolean): void {
    this.deleteModalOpen = open;
    if (!open) this.pendingDelete = null;
  }

  executeDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.deleteModalOpen = false;
    this.pendingDelete = null;
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders = this.orders.filter((o) => o.id !== id);
        this.feedback = 'Pedido eliminado.';
      },
      error: (err) => this.setError(err)
    });
  }

  getStatusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pendiente: 'ao-status--pending',
      procesando: 'ao-status--processing',
      enviada: 'ao-status--shipped',
      entregada: 'ao-status--delivered',
      cancelada: 'ao-status--cancelled'
    };
    return map[status] || '';
  }

  private clearMessages(): void {
    this.feedback = null;
    this.errorMsg = null;
  }

  private setError(err: unknown): void {
    const msg =
      err && typeof err === 'object' && err !== null && 'error' in err
        ? (err as { error?: { error?: string } }).error?.error
        : null;
    this.errorMsg = msg || 'No se pudo cargar los pedidos.';
  }
}
