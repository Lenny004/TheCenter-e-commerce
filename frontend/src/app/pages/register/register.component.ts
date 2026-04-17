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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMsg = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Los campos obligatorios deben completarse.';
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

    this.authService.register({
      name: this.name,
      email: this.email,
      phone: this.phone || undefined,
      password: this.password,
      rol: this.rol
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: HttpErrorResponse) => {
        const body = err.error as { error?: string } | undefined;
        this.errorMsg = body?.error ?? 'No se pudo crear la cuenta.';
      }
    });
  }
}
