// ============================================================================
// The Center — Componente raíz de la aplicación
// ============================================================================

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** Título de la aplicación */
  titulo = 'The Center';

  constructor(private auth: AuthService) {}

  /** Muestra el enlace al panel cuando el usuario es de área privada (tipo 2) */
  showPrivateAreaLink(): boolean {
    return this.auth.isPrivateAreaUser();
  }
}
