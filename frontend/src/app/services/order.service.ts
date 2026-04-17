// ============================================================================
// The Center — Pedidos (API administración)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../models';

const API = `${environment.apiUrl}/orders`;

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(API);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${API}/${id}`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${API}/${id}`, { status });
  }
}
