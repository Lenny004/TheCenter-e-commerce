import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserRole } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  rol: UserRole = 'cliente';
  errorMsg = '';
  submitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMsg = '';

    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const phone = this.phone.trim();

    if (!name || !email || !this.password) {
      this.errorMsg = 'Los campos obligatorios deben completarse.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMsg = 'Introduce un correo electrónico válido.';
      return;
    }
    if (this.password.length < 8) {
      this.errorMsg = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    this.submitting = true;
    this.authService
      .register({
        name,
        email,
        phone: phone || undefined,
        password: this.password,
        rol: this.rol
      })
      .subscribe({
        next: () =>
          this.router.navigate(['/login'], {
            queryParams: { registro: 'ok' }
          }),
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          const body = err.error as { error?: string } | undefined;
          this.errorMsg = body?.error ?? 'No se pudo crear la cuenta.';
        }
      });
  }
}
