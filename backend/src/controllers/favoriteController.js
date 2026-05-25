import { prisma } from '../config/prisma.js';

const productInclude = {
  images: {
    orderBy: { order: 'asc' },
  },
  category: true,
  collection: true,
  variants: {
    orderBy: { sku: 'asc' },
  },
};

export async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: productInclude,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ favorites });
  } catch (error) {
    return next(error);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
      include: {
        product: {
          include: productInclude,
        },
      },
    });

    if (existingFavorite) {
      return res.json({
        message: 'Product is already in favorites.',
        favorite: existingFavorite,
        product: existingFavorite.product,
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        productId,
      },
      include: {
        product: {
          include: productInclude,
        },
      },
    });

    return res.status(201).json({
      message: 'Product added to favorites.',
      favorite,
      product: favorite.product,
    });
  } catch (error) {
    return next(error);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { productId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    return res.json({ message: 'Product removed from favorites.', productId });
  } catch (error) {
    return next(error);
  }
}
