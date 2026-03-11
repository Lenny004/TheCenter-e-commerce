// ============================================================================
// The Center — Página de Catálogo
// ============================================================================

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  // TODO: Implementar
  // - Listar productos desde la API
  // - Filtrado por talla, género, categoría
  // - Paginación o scroll infinito
}
