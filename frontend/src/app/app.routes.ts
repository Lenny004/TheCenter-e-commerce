// ============================================================================
// The Center — Configuración de rutas de la aplicación
// ============================================================================

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'The Center — Dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'The Center — Dashboard'
  },
  {
    path: 'catalogo',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'The Center — Producto'
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(m => m.CartComponent),
    title: 'The Center — Carrito'
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'The Center — Perfil'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'The Center — Iniciar Sesión'
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'The Center — Registro'
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'The Center — Panel Admin'
    // TODO: Agregar guard de autenticación y rol admin
  },
  {
    path: 'admin/productos',
    loadComponent: () =>
      import('./pages/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
    title: 'The Center — Gestión de Productos'
  },
  {
    path: 'admin/pedidos',
    loadComponent: () =>
      import('./pages/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    title: 'The Center — Gestión de Pedidos'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
