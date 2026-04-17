// ============================================================================
// The Center — Administración de usuarios
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { User, UserRole } from '../../../models';
import { UserAdminService, UserUpdatePayload } from '../../../services/user-admin.service';
import { AdminModalComponent } from '../../../components/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, AdminModalComponent, TitleCasePipe],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  /** Filtro de listado: todos, solo personal interno o solo clientes de tienda. */
  roleFilter: 'all' | 'staff' | 'cliente' = 'staff';
  roles: UserRole[] = ['admin', 'vendedor', 'cliente'];

  modalOpen = false;
  editing: User | null = null;
  form = {
    name: '',
    email: '',
    phone: '',
    rol: 'cliente' as UserRole,
    password: ''
  };

  feedback: string | null = null;
  errorMsg: string | null = null;
  pendingDelete: User | null = null;
  deleteModalOpen = false;
  saving = false;

  constructor(private userAdminService: UserAdminService) {}

  get filteredUsers(): User[] {
    if (this.roleFilter === 'staff') {
      return this.users.filter((u) => u.rol === 'admin' || u.rol === 'vendedor');
    }
    if (this.roleFilter === 'cliente') {
      return this.users.filter((u) => u.rol === 'cliente');
    }
    return this.users;
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.userAdminService.getUsers().subscribe({
      next: (rows) => (this.users = rows),
      error: (err) => this.setError(err)
    });
  }

  openCreate(): void {
    this.editing = null;
    this.form = {
      name: '',
      email: '',
      phone: '',
      rol: 'cliente',
      password: ''
    };
    this.clearMessages();
    this.modalOpen = true;
  }

  openEdit(u: User): void {
    this.editing = u;
    this.form = {
      name: u.name,
      email: u.email,
      phone: u.phone ?? '',
      rol: u.rol,
      password: ''
    };
    this.clearMessages();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  save(): void {
    const name = this.form.name.trim();
    const email = this.form.email.trim();
    const phone = this.form.phone.trim() || null;
    const rol = this.form.rol;

    if (!name || name.length > 100) {
      this.errorMsg = 'Nombre obligatorio (máx. 100 caracteres).';
      return;
    }
    if (!email || email.length > 150) {
      this.errorMsg = 'Email inválido.';
      return;
    }
    if (phone && phone.length > 20) {
      this.errorMsg = 'Teléfono demasiado largo (máx. 20).';
      return;
    }

    if (!this.editing) {
      const pwd = this.form.password;
      if (!pwd || pwd.length < 6) {
        this.errorMsg = 'Contraseña obligatoria (mín. 6 caracteres) al crear usuario.';
        return;
      }
    }

    this.saving = true;
    this.clearMessages();

    if (this.editing) {
      const payload: UserUpdatePayload = {
        name,
        email,
        phone,
        rol
      };
      if (this.form.password.trim().length > 0) {
        payload.password = this.form.password;
      }
      this.userAdminService.update(this.editing.id, payload).subscribe({
        next: () => this.onSaved('Usuario actualizado.'),
        error: (err) => this.onSaveError(err)
      });
    } else {
      this.userAdminService
        .create({
          name,
          email,
          phone,
          password: this.form.password,
          rol
        })
        .subscribe({
          next: () => this.onSaved('Usuario creado.'),
          error: (err) => this.onSaveError(err)
        });
    }
  }

  private onSaved(msg: string): void {
    this.saving = false;
    this.feedback = msg;
    this.modalOpen = false;
    this.load();
  }

  private onSaveError(err: unknown): void {
    this.saving = false;
    this.setError(err);
  }

  confirmDelete(u: User): void {
    this.pendingDelete = u;
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
    this.userAdminService.delete(id).subscribe({
      next: () => {
        this.feedback = 'Usuario eliminado.';
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
