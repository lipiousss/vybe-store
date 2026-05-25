import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

export default router;
