import { Router } from 'express';
import {
  exportStock,
  getStock,
  updateVariantStock,
} from '../controllers/stockController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', adminOnly, getStock);
router.get('/export', adminOnly, exportStock);
router.patch('/variants/:variantId', adminOnly, updateVariantStock);

export default router;
