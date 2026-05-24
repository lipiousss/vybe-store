import { Router } from 'express';
import {
  getArtworkBySlug,
  getArtworks,
} from '../controllers/artworkController.js';

const router = Router();

router.get('/', getArtworks);
router.get('/:slug', getArtworkBySlug);

export default router;
