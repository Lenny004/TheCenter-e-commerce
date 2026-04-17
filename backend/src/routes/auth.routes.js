// ============================================================================
// Auth Routes — Qué hace: define las URLs del módulo de autenticación
// ============================================================================
// Asocia cada ruta HTTP con su controlador (p. ej. POST /register → register).

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

// Envuelve handlers async para que los errores lleguen al middleware de Express
const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);

const router = Router();

// POST /api/auth/register  →  crea un nuevo usuario
router.post('/register', wrapAsync(register));

// POST /api/auth/login  →  inicia sesión y devuelve token
router.post('/login', wrapAsync(login));

export default router;