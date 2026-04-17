// ============================================================================
// Guard: rutas reservadas solo para rol administrador (no vendedor)
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || !auth.isPrivateAreaUser()) {
    router.navigate(['/login'], { queryParams: { next: '/admin' } });
    return false;
  }
  if (!auth.isAdmin()) {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};
