import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', adminOnly, createCategory);
router.patch('/:id', adminOnly, updateCategory);
router.delete('/:id', adminOnly, deleteCategory);

export default router;
