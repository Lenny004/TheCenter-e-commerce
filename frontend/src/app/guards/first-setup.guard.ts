// ============================================================================
// Si no hay usuarios en el sistema, el primer paso es el registro de administrador.
// Usa Observable (no async/await) para integrarse bien con el router de Angular.
// ============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const redirectToFirstAdminRegisterGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getSetupStatus().pipe(
    take(1),
    map((s) =>
      s?.needsAdminSetup === true
        ? router.createUrlTree(['/registro'], { queryParams: { setup: '1' } })
        : true
    ),
    catchError(() => of(true))
  );
};
