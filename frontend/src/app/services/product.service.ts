// ============================================================================
// The Center — Servicio de Productos (Frontend)
// Comunicación con la API para catálogo y gestión de productos
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // TODO: Implementar
  // - getProducts(filters?)    → GET /api/products
  // - getProductById(id)       → GET /api/products/:id
  // - createProduct(data)      → POST /api/products
  // - updateProduct(id, data)  → PUT /api/products/:id
  // - deleteProduct(id)        → DELETE /api/products/:id

  constructor(private http: HttpClient) {}
}
