import { prisma } from '../config/prisma.js';

const cartInclude = {
  items: {
    orderBy: { id: 'asc' },
    include: {
      product: {
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          category: true,
          collection: true,
          variants: {
            orderBy: { sku: 'asc' },
          },
        },
      },
      variant: true,
    },
  },
};

function normalizeQuantity(quantity) {
  const parsed = Number(quantity || 1);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw Object.assign(new Error('Quantity must be at least 1.'), { statusCode: 400 });
  }

  return parsed;
}

function getItemPrice(item) {
  return Number(item.product.finalPrice || item.product.price || 0);
}

function formatCart(cart) {
  const items = cart.items || [];
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  return {
    ...cart,
    totalQuantity,
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}

async function getOrCreateCart(userId, tx = prisma) {
  const existingCart = await tx.cart.findUnique({
    where: { userId },
  });

  if (existingCart) {
    return existingCart;
  }

  return tx.cart.create({
    data: { userId },
  });
}

async function getCartResponse(userId) {
  const cart = await getOrCreateCart(userId);
  const fullCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });

  return formatCart(fullCart);
}

async function findProductOrThrow(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
  }

  return product;
}

async function findVariantOrThrow(productId, variantId) {
  if (!variantId) {
    return null;
  }

  const variant = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      productId,
    },
  });

  if (!variant) {
    throw Object.assign(new Error('Product variant not found.'), { statusCode: 404 });
  }

  return variant;
}

function getAvailableStock(product, variant) {
  if (variant) {
    return variant.stock;
  }

  if (product.variants.length > 0) {
    return product.variants.reduce((sum, item) => sum + item.stock, 0);
  }

  return Number.MAX_SAFE_INTEGER;
}

export async function getCart(req, res, next) {
  try {
    const cart = await getCartResponse(req.user.id);
    return res.json({ cart });
  } catch (error) {
    return next(error);
  }
}

export async function addCartItem(req, res, next) {
  try {
    const { productId, variantId } = req.body;
    const quantity = normalizeQuantity(req.body.quantity);

    if (!productId) {
      return res.status(400).json({ message: 'Product id is required.' });
    }

    const product = await findProductOrThrow(productId);
    const variant = await findVariantOrThrow(productId, variantId || null);
    const availableStock = getAvailableStock(product, variant);

    if (quantity > availableStock) {
      return res.status(400).json({ message: 'Not enough stock for this item.' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;

      if (nextQuantity > availableStock) {
        return res.status(400).json({ message: 'Not enough stock for this item.' });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    const updatedCart = await getCartResponse(req.user.id);
    return res.status(201).json({ cart: updatedCart });
  } catch (error) {
    return next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const quantity = normalizeQuantity(req.body.quantity);
    const cart = await getOrCreateCart(req.user.id);
    const item = await prisma.cartItem.findFirst({
      where: {
        id: req.params.itemId,
        cartId: cart.id,
      },
      include: {
        product: {
          include: { variants: true },
        },
        variant: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    const availableStock = getAvailableStock(item.product, item.variant);

    if (quantity > availableStock) {
      return res.status(400).json({ message: 'Not enough stock for this item.' });
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    const updatedCart = await getCartResponse(req.user.id);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);

    await prisma.cartItem.deleteMany({
      where: {
        id: req.params.itemId,
        cartId: cart.id,
      },
    });

    const updatedCart = await getCartResponse(req.user.id);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const updatedCart = await getCartResponse(req.user.id);
    return res.json({ cart: updatedCart });
  } catch (error) {
    return next(error);
  }
}
