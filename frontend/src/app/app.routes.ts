// ============================================================================
// The Center — Configuración de rutas de la aplicación
// ============================================================================

import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { adminOnlyGuard } from './guards/admin-only.guard';
import { redirectToFirstAdminRegisterGuard } from './guards/first-setup.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectToFirstAdminRegisterGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'The Center — Dashboard'
  },
  {
    path: 'dashboard',
    canActivate: [redirectToFirstAdminRegisterGuard],
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
    canActivate: [redirectToFirstAdminRegisterGuard],
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
      import('./pages/admin/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'The Center — Panel Admin'
      },
      {
        path: 'categorias',
        canActivate: [adminOnlyGuard],
        loadComponent: () =>
          import('./pages/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
        title: 'The Center — Categorías'
      },
      {
        path: 'tallas',
        canActivate: [adminOnlyGuard],
        loadComponent: () =>
          import('./pages/admin/admin-sizes/admin-sizes.component').then(m => m.AdminSizesComponent),
        title: 'The Center — Tallas'
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
        title: 'The Center — Gestión de Productos'
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
        title: 'The Center — Gestión de Pedidos'
      },
      {
        path: 'usuarios',
        canActivate: [adminOnlyGuard],
        loadComponent: () =>
          import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'The Center — Empleados y cuentas'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
