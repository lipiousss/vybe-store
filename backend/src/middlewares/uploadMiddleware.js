import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.resolve(__dirname, '../../uploads/avatars');
const productsDir = path.resolve(__dirname, '../../uploads/products');
const artworksDir = path.resolve(__dirname, '../../uploads/artworks');
const siteDir = path.resolve(__dirname, '../../uploads/site');
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

fs.mkdirSync(avatarsDir, { recursive: true });
fs.mkdirSync(productsDir, { recursive: true });
fs.mkdirSync(artworksDir, { recursive: true });
fs.mkdirSync(siteDir, { recursive: true });

function createStorage(destination) {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, destination);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${req.user.id}-${Date.now()}${ext}`;
      cb(null, safeName);
    },
  });
}

const avatarStorage = createStorage(avatarsDir);

const productUploadStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, productsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `product-${req.user.id}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

function createNamedUploadStorage(destination, prefix) {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, destination);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${prefix}-${req.user.id}-${Date.now()}${ext}`;
      cb(null, safeName);
    },
  });
}

function fileFilter(req, file, cb) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(Object.assign(new Error('Only jpeg, png, and webp images are allowed.'), {
      statusCode: 400,
    }));
  }

  return cb(null, true);
}

export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const productImageUpload = multer({
  storage: productUploadStorage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

export const artworkImageUpload = multer({
  storage: createNamedUploadStorage(artworksDir, 'artwork'),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const siteAssetImageUpload = multer({
  storage: createNamedUploadStorage(siteDir, 'site'),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
