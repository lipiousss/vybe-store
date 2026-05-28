import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import siteAssetRoutes from './routes/siteAssetRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../uploads');
const defaultClientUrls = [
  'http://localhost:5173',
  'https://lipioussss.netlify.app',
];

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/$/, '');
}

const configuredClientUrls = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  ...defaultClientUrls,
]
  .filter(Boolean)
  .join(',');

const allowedOrigins = configuredClientUrls
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin);

    if (
      !normalizedOrigin
      || allowedOrigins.includes(normalizedOrigin)
      || normalizedOrigin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin is not allowed: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsPath));

app.get('/', (req, res) => {
  res.json({
    service: 'vybe-store-backend',
    status: 'ok',
  });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      database: 'connected',
      orm: 'prisma',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'unavailable',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/site-assets', siteAssetRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/users', userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
