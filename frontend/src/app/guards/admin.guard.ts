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
  // Permite acceso al área privada a usuarios tipo 2 (admin y vendedor)
  if (!authService.isPrivateAreaUser()) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
