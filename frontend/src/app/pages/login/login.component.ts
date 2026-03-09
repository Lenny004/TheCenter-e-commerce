// ============================================================================
// The Center — Página de Inicio de Sesión
// ============================================================================

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // TODO: Implementar
  // - Formulario de login (email + contraseña)
  // - Enviar credenciales a la API
  // - Guardar token JWT
  // - Redireccionar al usuario
}
