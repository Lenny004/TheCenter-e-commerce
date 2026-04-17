// ============================================================================
// Auth Middleware — JWT y autorización por rol
// ============================================================================

import jwt from 'jsonwebtoken';

/**
 * Verifica Bearer JWT y adjunta `req.user` = { id, email, rol }.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

/**
 * @param {...string} allowedRoles - Roles permitidos (p. ej. 'admin', 'vendedor')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tiene permisos para esta operación.' });
    }
    next();
  };
}
