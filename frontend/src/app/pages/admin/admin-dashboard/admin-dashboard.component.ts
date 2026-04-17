// ============================================================================
// The Center — Resumen del panel de administración
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AdminMetricsService } from '../../../services/admin-metrics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  metrics = {
    totalSales: 0,
    lowStock: 0,
    pendingOrders: 0,
    totalUsers: 0,
    lowStockThreshold: 5
  };
  errorMsg: string | null = null;

  constructor(private adminMetrics: AdminMetricsService) {}

  ngOnInit(): void {
    this.adminMetrics.getDashboard().subscribe({
      next: (m) => {
        this.metrics = m;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar las métricas. Compruebe la sesión y el servidor API.';
      }
    });
  }
}
