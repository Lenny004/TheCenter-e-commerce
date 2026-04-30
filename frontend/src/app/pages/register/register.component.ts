import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { take } from 'rxjs';
import { UserRole } from '../../models';
import { AuthService, normalizeSessionUser } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  rol: UserRole = 'cliente';
  /** True cuando no hay ningún usuario en el sistema: solo alta como administrador. */
  needsAdminSetup = false;
  /** Evita mostrar el selector de rol antes de saber si es el primer uso. */
  setupResolved = false;
  submitting = false;

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    customClass: {
      popup: 'app-toast'
    }
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService
      .getSetupStatus()
      .pipe(take(1))
      .subscribe({
        next: (s) => {
          this.needsAdminSetup = s.needsAdminSetup;
          if (s.needsAdminSetup) {
            this.rol = 'admin';
          }
          this.setupResolved = true;
          if (!s.needsAdminSetup && this.route.snapshot.queryParamMap.get('setup') === '1') {
            this.router.navigate(['/registro'], { replaceUrl: true });
          }
        },
        error: () => {
          this.needsAdminSetup = false;
          this.setupResolved = true;
        }
      });
  }

  onSubmit(): void {
    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const phone = this.phone.trim();

    if (!name || !email || !this.password) {
      this.showToast('error', 'Los campos obligatorios deben completarse.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showToast('error', 'Introduce un correo electrónico valido.');
      return;
    }
    if (this.password.length < 8) {
      this.showToast('error', 'La contrasena debe tener al menos 8 caracteres.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showToast('error', 'Las contrasenas no coinciden.');
      return;
    }

    this.submitting = true;
    const payload = this.needsAdminSetup
      ? { name, email, phone: phone || undefined, password: this.password, rol: 'admin' as UserRole }
      : { name, email, phone: phone || undefined, password: this.password, rol: this.rol };

    this.authService.register(payload).subscribe({
      next: () => {
        if (this.needsAdminSetup) {
          this.authService.login(email, this.password).subscribe({
            next: (res) => {
              this.submitting = false;
              this.authService.saveSession(res.token, normalizeSessionUser(res.user));
              this.router.navigateByUrl('/admin');
            },
            error: (err: HttpErrorResponse) => {
              this.submitting = false;
              const body = err.error as { error?: string } | undefined;
              this.showToast(
                'warning',
                body?.error ??
                  'Cuenta creada, pero no se pudo iniciar sesion automaticamente. Entra en Iniciar sesion.'
              );
            }
          });
        } else {
          this.submitting = false;
          this.router.navigate(['/login'], { queryParams: { registro: 'ok' } });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        const body = err.error as { error?: string } | undefined;
        this.showToast('error', body?.error ?? 'No se pudo crear la cuenta.');
      }
    });
  }

  private showToast(icon: 'success' | 'error' | 'warning' | 'info', title: string): void {
    this.toast.fire({
      icon,
      title,
      customClass: {
        popup: `app-toast app-toast--${icon}`
      }
    });
  }
}
