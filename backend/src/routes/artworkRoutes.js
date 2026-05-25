import { Router } from 'express';
import {
  createArtwork,
  deleteArtwork,
  getAdminArtworks,
  getArtworkBySlug,
  getArtworks,
  updateArtwork,
  uploadArtworkImage,
} from '../controllers/artworkController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { artworkImageUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/admin/all', adminOnly, getAdminArtworks);
router.post('/upload-image', adminOnly, artworkImageUpload.single('image'), uploadArtworkImage);
router.get('/', getArtworks);
router.post('/', adminOnly, createArtwork);
router.get('/:slug', getArtworkBySlug);
router.patch('/:id', adminOnly, updateArtwork);
router.delete('/:id', adminOnly, deleteArtwork);

export default router;
