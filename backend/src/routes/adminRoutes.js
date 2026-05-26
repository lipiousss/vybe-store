import { Router } from 'express';
import {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserBlock,
  updateAdminUserRole,
} from '../controllers/adminController.js';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../controllers/categoryController.js';
import {
  createCollection,
  deleteCollection,
  getAdminCollections,
  updateCollection,
} from '../controllers/collectionController.js';
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
router.get('/collections', adminOnly, getAdminCollections);
router.post('/collections', adminOnly, createCollection);
router.patch('/collections/:id', adminOnly, updateCollection);
router.delete('/collections/:id', adminOnly, deleteCollection);
router.get('/categories', adminOnly, getAdminCategories);
router.post('/categories', adminOnly, createCategory);
router.patch('/categories/:id', adminOnly, updateCategory);
router.delete('/categories/:id', adminOnly, deleteCategory);
router.get('/users', adminOnly, getAdminUsers);
router.get('/users/:id', adminOnly, getAdminUserById);
router.patch('/users/:id/role', adminOnly, updateAdminUserRole);
router.patch('/users/:id/block', adminOnly, updateAdminUserBlock);

export default router;
