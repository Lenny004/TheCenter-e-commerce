// ============================================================================
// The Center — Guard de Rol Administrativo
// Protege rutas que requieren rol de administrador
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional que verifica si el usuario tiene rol de admin.
 * Redirige a / si el usuario no es administrador.
 */
export const adminGuard: CanActivateFn = () => {
  // TODO: Implementar verificación real de rol
  const authService = inject(AuthService);
  const router = inject(Router);

  // Placeholder — siempre permite acceso hasta que se implemente
  return true;
};
