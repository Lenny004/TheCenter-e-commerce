// ============================================================================
// The Center — Rutas de usuarios (solo administración)
// ============================================================================

import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.use(verifyToken, authorize('admin'));

router.get('/', wrap(userController.list));
router.get('/:id', wrap(userController.getById));
router.post('/', wrap(userController.create));
router.put('/:id', wrap(userController.update));
router.delete('/:id', wrap(userController.remove));

export default router;
