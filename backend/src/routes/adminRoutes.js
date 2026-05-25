import { Router } from 'express';
import {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserBlock,
  updateAdminUserRole,
} from '../controllers/adminController.js';
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/orders', adminOnly, getAdminOrders);
router.patch('/orders/:id/status', adminOnly, updateAdminOrderStatus);
router.get('/users', adminOnly, getAdminUsers);
router.get('/users/:id', adminOnly, getAdminUserById);
router.patch('/users/:id/role', adminOnly, updateAdminUserRole);
router.patch('/users/:id/block', adminOnly, updateAdminUserBlock);

export default router;
