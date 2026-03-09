// ============================================================================
// The Center — Servicio de Órdenes (Frontend)
// Consulta de pedidos del usuario
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  // TODO: Implementar
  // - getOrders()             → GET /api/orders
  // - getOrderById(id)        → GET /api/orders/:id
  // - updateOrderStatus(id)   → PUT /api/orders/:id (admin)

  constructor(private http: HttpClient) {}
}
