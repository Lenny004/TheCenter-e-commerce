// ============================================================================
// The Center — Rutas de Productos
// ============================================================================

import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyToken, authorize, optionalVerifyToken } from '../middlewares/auth.middleware.js';
import { productImageUpload } from '../middlewares/upload.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.get('/', wrap(productController.getAll));
router.get('/panel', verifyToken, authorize('admin', 'vendedor'), wrap(productController.getPanelList));
router.get('/:id', optionalVerifyToken, wrap(productController.getById));
router.post(
  '/',
  verifyToken,
  authorize('admin', 'vendedor'),
  productImageUpload.single('image'),
  wrap(productController.create)
);
router.put(
  '/:id',
  verifyToken,
  authorize('admin', 'vendedor'),
  productImageUpload.single('image'),
  wrap(productController.update)
);
router.delete('/:id', verifyToken, authorize('admin', 'vendedor'), wrap(productController.remove));

export default router;
