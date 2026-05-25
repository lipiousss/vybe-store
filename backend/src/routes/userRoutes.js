import { Router } from 'express';
import {
  changeEmail,
  changePassword,
  getProfile,
  updatePhone,
  updateProfile,
  uploadAvatar,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { avatarUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.patch('/change-email', changeEmail);
router.patch('/phone', updatePhone);
router.post('/avatar', avatarUpload.single('avatar'), uploadAvatar);

export default router;
