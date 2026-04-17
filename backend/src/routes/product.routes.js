// ============================================================================
// The Center — Rutas de Productos
// ============================================================================

import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', wrap(productController.getAll));
router.get('/:id', wrap(productController.getById));
router.post('/', verifyToken, authorize('admin'), wrap(productController.create));
router.put('/:id', verifyToken, authorize('admin'), wrap(productController.update));
router.delete('/:id', verifyToken, authorize('admin'), wrap(productController.remove));

export default router;
