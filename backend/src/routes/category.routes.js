// ============================================================================
// The Center — Rutas de Categorías
// ============================================================================

import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', wrap(categoryController.list));
router.post('/', verifyToken, authorize('admin'), wrap(categoryController.create));
router.put('/:id', verifyToken, authorize('admin'), wrap(categoryController.update));
router.delete('/:id', verifyToken, authorize('admin'), wrap(categoryController.remove));

export default router;
