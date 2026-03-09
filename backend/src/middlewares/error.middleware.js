// ============================================================================
// The Center — Middleware de Manejo de Errores
// Captura y formatea errores de forma centralizada
// ============================================================================

/**
 * Clase personalizada para errores de la API
 * Extiende Error nativo con código de estado HTTP
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - Código de estado HTTP
   * @param {string} message - Mensaje descriptivo del error
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Middleware de manejo de errores centralizado
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]', err.stack || err.message);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message
  });
};
