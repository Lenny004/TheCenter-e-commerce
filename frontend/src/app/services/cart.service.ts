// ============================================================================
// The Center — Servicio de Carrito (Frontend)
// Gestión del carrito de compras (API + localStorage como fallback)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  // TODO: Implementar
  // - getCart()                  → GET /api/cart o localStorage
  // - addToCart(productId, qty)  → POST /api/cart
  // - updateQuantity(id, qty)   → PUT /api/cart/:id
  // - removeItem(id)            → DELETE /api/cart/:id
  // - checkout()                → POST /api/cart/checkout
  // - getCartCount()            → Cantidad total de items (observable)

  constructor(private http: HttpClient) {}
}
