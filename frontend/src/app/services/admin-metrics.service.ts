// ============================================================================
// The Center — Métricas del panel admin
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminDashboardMetrics {
  totalSales: number;
  lowStock: number;
  pendingOrders: number;
  /** Solo administrador; null en vista vendedor */
  totalUsers: number | null;
  lowStockThreshold: number;
  /** true cuando las métricas están acotadas al vendedor autenticado */
  sellerMode?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminMetricsService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboardMetrics> {
    return this.http.get<AdminDashboardMetrics>(`${environment.apiUrl}/admin/dashboard`);
  }
}
