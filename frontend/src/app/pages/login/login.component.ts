// ============================================================================
// Login — Pantalla de inicio de sesión
// ============================================================================
// Valida campos, llama al servicio de autenticación y redirige según userType
// (1 = tienda pública, 2 = área privada). Los errores HTTP se muestran igual
// que en el flujo de registro (mensaje desde el cuerpo de la respuesta).

import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, normalizeSessionUser, UserSession } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  submitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('registro') === 'ok') {
      this.successMsg = 'Cuenta creada. Inicia sesión con tu correo y contraseña.';
    }
    if (this.route.snapshot.queryParamMap.get('setup') === 'ok') {
      this.successMsg = 'Cuenta de administrador creada. Inicia sesión para continuar.';
    }
  }

  onSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }

    this.submitting = true;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.submitting = false;
        const user = normalizeSessionUser(res.user);
        this.authService.saveSession(res.token, user);
        const target = this.resolveRedirect(user);
        this.router.navigateByUrl(target);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        const body = err.error as { error?: string } | undefined;
        this.errorMsg = body?.error ?? 'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }

  /**
   * Devuelve la ruta de destino tras un login correcto.
   * Usa el usuario ya normalizado (userType + rol). Respeta ?next= para staff.
   */
  private resolveRedirect(user: UserSession): string {
    const isStaff = user.userType === 2 || user.rol !== 'cliente';
    const next = this.route.snapshot.queryParamMap.get('next');
    if (next && next.startsWith('/') && isStaff) {
      return next;
    }
    if (isStaff) {
      return '/admin';
    }
    return '/';
  }
}
