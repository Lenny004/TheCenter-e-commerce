// ============================================================================
// The Center — Guard: solo administradores autenticados
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { next: '/admin' } });
    return false;
  }
  if (!authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
