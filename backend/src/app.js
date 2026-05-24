import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { prisma } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/artworks', artworkRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/products', productRoutes);

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
