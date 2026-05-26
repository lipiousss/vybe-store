import { Router } from 'express';
import {
  getAnalyticsOverview,
  getLowStock,
  getRecentOrders,
  getStockMovements,
  getTopProducts,
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/overview', adminOnly, getAnalyticsOverview);
router.get('/recent-orders', adminOnly, getRecentOrders);
router.get('/low-stock', adminOnly, getLowStock);
router.get('/top-products', adminOnly, getTopProducts);
router.get('/stock-movements', adminOnly, getStockMovements);

export default router;
