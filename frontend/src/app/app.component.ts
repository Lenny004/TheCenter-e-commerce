// ============================================================================
// The Center — Componente raíz de la aplicación
// ============================================================================

import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titulo = 'The Center';

  constructor(
    readonly auth: AuthService,
    private router: Router
  ) {}

  /** Invitados y clientes: enlace a la tienda (carrito). Staff no lo usa en cabecera. */
  showCartInHeader(): boolean {
    return !this.auth.isLoggedIn() || this.auth.getUser()?.rol === 'cliente';
  }

  /** Solo clientes autenticados: acceso al perfil */
  showProfileLink(): boolean {
    return this.auth.isLoggedIn() && this.auth.getUser()?.rol === 'cliente';
  }

  showPrivateAreaLink(): boolean {
    return this.auth.isPrivateAreaUser();
  }

  privateAreaNavLabel(): string {
    return this.auth.isVendor() ? 'Panel' : 'Admin';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
