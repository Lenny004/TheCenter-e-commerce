// ============================================================================
// The Center — Rutas de Órdenes
// ============================================================================

import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', verifyToken, authorize('admin', 'vendedor'), wrap(orderController.getAll));
router.get('/:id', verifyToken, authorize('admin', 'vendedor'), wrap(orderController.getById));
router.put('/:id', verifyToken, authorize('admin', 'vendedor'), wrap(orderController.update));
router.delete('/:id', verifyToken, authorize('admin'), wrap(orderController.remove));
router.post('/checkout', orderController.checkout);

export default router;
