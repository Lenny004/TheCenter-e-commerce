// ============================================================================
// The Center — Middleware de Autenticación
// Verifica JWT y controla acceso por roles
// ============================================================================

// TODO: Implementar
// - authenticate(req, res, next)     → Verificar token JWT en headers
// - authorize(roles)(req, res, next) → Verificar que el usuario tenga el rol requerido

/**
 * Middleware placeholder de autenticación
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authenticate = (req, res, next) => {
  // TODO: Implementar verificación de JWT
  next();
};

/**
 * Middleware placeholder de autorización por roles
 * @param {string[]} roles - Roles permitidos
 */
export const authorize = (roles) => {
  return (req, res, next) => {
    // TODO: Implementar verificación de rol
    next();
  };
};
