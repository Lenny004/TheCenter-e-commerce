// ============================================================================
// The Center — Página de Carrito de Compras
// ============================================================================

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  // TODO: Implementar
  // - Listar items del carrito
  // - Actualizar cantidades
  // - Eliminar items
  // - Calcular total
  // - Botón de checkout
}
