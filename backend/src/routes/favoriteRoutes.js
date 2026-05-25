import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/:productId', addFavorite);
router.delete('/:productId', removeFavorite);

export default router;
