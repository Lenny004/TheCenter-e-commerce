// ============================================================================
// The Center — Rutas de Tallas
// ============================================================================

import { Router } from 'express';
import * as sizeController from '../controllers/size.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', wrap(sizeController.list));
router.post('/', verifyToken, authorize('admin'), wrap(sizeController.create));
router.put('/:id', verifyToken, authorize('admin'), wrap(sizeController.update));
router.delete('/:id', verifyToken, authorize('admin'), wrap(sizeController.remove));

export default router;
