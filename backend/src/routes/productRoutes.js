import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  uploadProductImage,
  updateProduct,
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { productImageUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', getProducts);
router.get('/admin/:id', adminOnly, getProductById);
router.post('/upload-image', adminOnly, productImageUpload.single('image'), uploadProductImage);
router.get('/:slug', getProductBySlug);
router.post('/', adminOnly, createProduct);
router.patch('/:id', adminOnly, updateProduct);
router.delete('/:id', adminOnly, deleteProduct);

export default router;
