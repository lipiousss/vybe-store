import { Router } from 'express';
import {
  getSiteAssetByKey,
  getSiteAssets,
  updateSiteAsset,
  uploadSiteAssetImage,
} from '../controllers/siteAssetController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { siteAssetImageUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();
const adminOnly = [authMiddleware, roleMiddleware('ADMIN')];

router.get('/', getSiteAssets);
router.post('/upload-image', adminOnly, siteAssetImageUpload.single('image'), uploadSiteAssetImage);
router.get('/:key', getSiteAssetByKey);
router.patch('/:key', adminOnly, updateSiteAsset);

export default router;
