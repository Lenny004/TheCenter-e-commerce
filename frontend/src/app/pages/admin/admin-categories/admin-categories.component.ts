// ============================================================================
// The Center — Administración de categorías
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models';
import { CategoryService } from '../../../services/category.service';
import { AdminModalComponent } from '../../../components/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, AdminModalComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  modalOpen = false;
  editing: Category | null = null;
  formName = '';
  feedback: string | null = null;
  errorMsg: string | null = null;
  pendingDelete: Category | null = null;
  deleteModalOpen = false;
  saving = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.getCategories().subscribe({
      next: (rows) => (this.categories = rows),
      error: (err) => this.setError(err)
    });
  }

  openCreate(): void {
    this.editing = null;
    this.formName = '';
    this.clearMessages();
    this.modalOpen = true;
  }

  openEdit(cat: Category): void {
    this.editing = cat;
    this.formName = cat.name;
    this.clearMessages();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    const name = this.formName.trim();
    if (!name || name.length > 100) {
      this.errorMsg = 'El nombre es obligatorio (máx. 100 caracteres).';
      return;
    }
    this.saving = true;
    this.clearMessages();
    const req = this.editing
      ? this.categoryService.update(this.editing.id, { name })
      : this.categoryService.create({ name });
    req.subscribe({
      next: () => {
        this.saving = false;
        this.feedback = this.editing ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.';
        this.modalOpen = false;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.setError(err);
      }
    });
  }

  confirmDelete(cat: Category): void {
    this.pendingDelete = cat;
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
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.feedback = 'Categoría eliminada.';
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
