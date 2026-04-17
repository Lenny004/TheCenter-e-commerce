// ============================================================================
// The Center — Configuración de entorno (desarrollo por defecto)
// ============================================================================

export const environment = {
  production: false,
  apiUrl: '/api',
  /**
   * Si las peticiones a `/api` fallan (p. ej. `ng serve` sin proxy o otro puerto),
   * se reintenta contra el backend en este origen. Dejar vacío si todo va por el mismo host.
   */
  apiDirectBase: 'http://localhost:5000'
};
