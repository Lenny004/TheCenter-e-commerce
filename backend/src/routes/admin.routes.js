// ============================================================================
// The Center — Rutas de Administración
// ============================================================================

import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/dashboard', verifyToken, authorize('admin', 'vendedor'), wrap(adminController.dashboard));

export default router;
