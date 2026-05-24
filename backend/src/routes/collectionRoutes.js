import { Router } from 'express';
import {
  createCollection,
  deleteCollection,
  getCollectionBySlug,
  getCollections,
  updateCollection,
} from '../controllers/collectionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', getCollections);
router.get('/:slug', getCollectionBySlug);
router.post('/', adminOnly, createCollection);
router.patch('/:id', adminOnly, updateCollection);
router.delete('/:id', adminOnly, deleteCollection);

export default router;
