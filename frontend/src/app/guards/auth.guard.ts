// ============================================================================
// The Center — Guard de Autenticación
// Protege rutas que requieren sesión activa
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional que verifica si el usuario está autenticado.
 * Redirige a /login si no hay sesión activa.
 */
export const authGuard: CanActivateFn = () => {
  // TODO: Implementar verificación real de token
  const authService = inject(AuthService);
  const router = inject(Router);

  // Placeholder — siempre permite acceso hasta que se implemente
  return true;
};
