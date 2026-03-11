import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../models';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  statuses: OrderStatus[] = ['pendiente', 'procesando', 'enviada', 'entregada', 'cancelada'];
  expandedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(o => this.orders = o);
  }

  toggleDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  updateStatus(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe(updated => {
      order.status = updated.status;
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
}
