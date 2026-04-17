// ============================================================================
// The Center — Administración de tallas
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Size } from '../../../models';
import { SizeService } from '../../../services/size.service';
import { AdminModalComponent } from '../../../components/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-sizes',
  standalone: true,
  imports: [FormsModule, AdminModalComponent],
  templateUrl: './admin-sizes.component.html',
  styleUrl: './admin-sizes.component.css'
})
export class AdminSizesComponent implements OnInit {
  sizes: Size[] = [];
  modalOpen = false;
  editing: Size | null = null;
  formSize = '';
  feedback: string | null = null;
  errorMsg: string | null = null;
  pendingDelete: Size | null = null;
  deleteModalOpen = false;
  saving = false;

  constructor(private sizeService: SizeService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.sizeService.getSizes().subscribe({
      next: (rows) => (this.sizes = rows),
      error: (err) => this.setError(err)
    });
  }

  openCreate(): void {
    this.editing = null;
    this.formSize = '';
    this.clearMessages();
    this.modalOpen = true;
  }

  openEdit(row: Size): void {
    this.editing = row;
    this.formSize = row.size;
    this.clearMessages();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    const size = this.formSize.trim();
    if (!size || size.length > 50) {
      this.errorMsg = 'La talla es obligatoria (máx. 50 caracteres).';
      return;
    }
    this.saving = true;
    this.clearMessages();
    const req = this.editing
      ? this.sizeService.update(this.editing.id, { size })
      : this.sizeService.create({ size });
    req.subscribe({
      next: () => {
        this.saving = false;
        this.feedback = this.editing ? 'Talla actualizada correctamente.' : 'Talla creada correctamente.';
        this.modalOpen = false;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.setError(err);
      }
    });
  }

  confirmDelete(row: Size): void {
    this.pendingDelete = row;
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
    this.sizeService.delete(id).subscribe({
      next: () => {
        this.feedback = 'Talla eliminada.';
        this.load();
      },
      error: (err) => this.setError(err)
    });
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
    this.errorMsg = msg || 'No se pudo completar la operación.';
  }
}
