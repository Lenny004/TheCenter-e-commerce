import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order, OrderDetail, OrderStatus } from '../models';

const MOCK_ORDERS: Order[] = [
  {
    id: 1001,
    user_id: 1,
    total: 248.99,
    status: 'pendiente',
    user: { id: 1, name: 'Adrián', phone: '+503 7890-1234', email: 'adrian@example.com', rol: 'cliente' },
    details: [
      { id: 1, order_id: 1001, product_id: 1, quantity: 1, unit_price: 89.99 },
      { id: 2, order_id: 1001, product_id: 2, quantity: 1, unit_price: 159.00 }
    ]
  },
  {
    id: 1002,
    user_id: 2,
    total: 299.99,
    status: 'enviada',
    user: { id: 2, name: 'María López', phone: null, email: 'maria@example.com', rol: 'cliente' },
    details: [
      { id: 3, order_id: 1002, product_id: 3, quantity: 1, unit_price: 299.99 }
    ]
  },
  {
    id: 1003,
    user_id: 3,
    total: 124.50,
    status: 'entregada',
    user: { id: 3, name: 'Carlos Ruiz', phone: '+503 6543-2100', email: 'carlos@example.com', rol: 'cliente' },
    details: [
      { id: 4, order_id: 1003, product_id: 4, quantity: 1, unit_price: 124.50 }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    // TODO: GET /api/orders
    return of(MOCK_ORDERS);
  }

  getOrderById(id: number): Observable<Order | undefined> {
    // TODO: GET /api/orders/:id
    return of(MOCK_ORDERS.find(o => o.id === id));
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    // TODO: PUT /api/orders/:id
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (order) order.status = status;
    return of(order as Order);
  }
}
