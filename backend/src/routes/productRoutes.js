import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', adminOnly, createProduct);
router.patch('/:id', adminOnly, updateProduct);
router.delete('/:id', adminOnly, deleteProduct);

export default router;
