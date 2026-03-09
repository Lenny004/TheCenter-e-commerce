// ============================================================================
// The Center — Página de Inicio (Home)
// ============================================================================

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // TODO: Implementar lógica de la página de inicio
  // - Productos destacados
  // - Categorías principales
  // - Banner promocional
}
