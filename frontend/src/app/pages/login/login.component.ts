// ============================================================================
// Login — Pantalla de inicio de sesión
// ============================================================================
// Valida campos, llama al servicio de autenticación y redirige según userType
// (1 = tienda pública, 2 = panel privado). Los errores HTTP se muestran igual
// que en el flujo de registro (mensaje desde el cuerpo de la respuesta).

import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // Persiste la sesión del mismo modo que espera el resto de la aplicación
        this.authService.saveSession(res.token, res.user);
        // Redirige según el tipo de usuario: 1 = tienda pública, 2 = área privada
        const target = this.resolveRedirect(res.user.userType);
        this.router.navigateByUrl(target);
      },
      error: (err: HttpErrorResponse) => {
        const body = err.error as { error?: string } | undefined;
        this.errorMsg = body?.error ?? 'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }

  /**
   * Devuelve la ruta de destino tras un login correcto.
   * Respeta ?next= si existe y el usuario tiene permiso para esa URL.
   */
  private resolveRedirect(userType: 1 | 2): string {
    const next = this.route.snapshot.queryParamMap.get('next');
    if (next && next.startsWith('/') && userType === 2) {
      return next;
    }
    if (userType === 2) {
      return '/admin';
    }
    return '/';
  }
}
