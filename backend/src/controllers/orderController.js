import { prisma } from '../config/prisma.js';
import { isValidEmail, isValidPhone } from '../utils/validators.js';

const orderStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const orderInclude = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
    },
  },
  items: {
    include: {
      product: {
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          category: true,
          collection: true,
        },
      },
      variant: true,
    },
  },
};

const cartInclude = {
  items: {
    include: {
      product: true,
      variant: true,
    },
  },
};

function validateOrderBody(body) {
  const requiredFields = [
    'customerName',
    'customerPhone',
    'customerEmail',
    'deliveryCity',
    'deliveryAddress',
  ];

  for (const field of requiredFields) {
    if (!String(body[field] || '').trim()) {
      return `${field} is required.`;
    }
  }

  if (!isValidPhone(body.customerPhone)) {
    return 'Phone format must be +7 (999) 999-99-99.';
  }

  if (!isValidEmail(body.customerEmail)) {
    return 'Email is invalid.';
  }

  return null;
}

function getItemPrice(item) {
  return Number(item.product.finalPrice || item.product.price || 0);
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
}

async function getUserCart(userId, tx = prisma) {
  return tx.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });
}

function assertCartCanBeOrdered(cart) {
  if (!cart || cart.items.length === 0) {
    throw Object.assign(new Error('Cart is empty.'), { statusCode: 400 });
  }

  for (const item of cart.items) {
    if (item.variant && item.quantity > item.variant.stock) {
      throw Object.assign(new Error(`Not enough stock for ${item.product.name}.`), { statusCode: 400 });
    }
  }
}

export async function createOrder(req, res, next) {
  try {
    const validationError = validateOrderBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const order = await prisma.$transaction(async (tx) => {
      const cart = await getUserCart(req.user.id, tx);
      assertCartCanBeOrdered(cart);

      const totalPrice = calculateTotal(cart.items).toFixed(2);

      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalPrice,
          customerName: req.body.customerName.trim(),
          customerPhone: req.body.customerPhone.trim(),
          customerEmail: req.body.customerEmail.trim().toLowerCase(),
          deliveryCity: req.body.deliveryCity.trim(),
          deliveryAddress: req.body.deliveryAddress.trim(),
          comment: req.body.comment?.trim() || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: getItemPrice(item).toFixed(2),
            })),
          },
        },
      });

      for (const item of cart.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.stockMovement.create({
            data: {
              productVariantId: item.variantId,
              type: 'SALE',
              quantity: item.quantity,
              comment: `Order ${createdOrder.id}`,
              createdById: req.user.id,
            },
          });
        }
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: orderInclude,
      });
    });

    return res.status(201).json({ order });
  } catch (error) {
    return next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const where = req.user.role === 'ADMIN'
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.id };

    const order = await prisma.order.findFirst({
      where,
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ order });
  } catch (error) {
    return next(error);
  }
}

function buildAdminOrderWhere(query) {
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { customerName: { contains: query.search, mode: 'insensitive' } },
      { customerEmail: { contains: query.search, mode: 'insensitive' } },
      { customerPhone: { contains: query.search, mode: 'insensitive' } },
      {
        user: {
          is: {
            email: { contains: query.search, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  return where;
}

export async function getAdminOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: buildAdminOrderWhere(req.query),
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminOrderStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!orderStatuses.includes(status)) {
      return res.status(400).json({ message: 'Order status is invalid.' });
    }

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: req.params.id },
        data: { status },
        include: orderInclude,
      });

      await tx.adminLog.create({
        data: {
          adminId: req.user.id,
          action: 'UPDATE_ORDER_STATUS',
          entity: 'Order',
          entityId: updatedOrder.id,
          description: `Order status changed to ${status}`,
        },
      });

      return updatedOrder;
    });

    return res.json({ order });
  } catch (error) {
    return next(error);
  }
}
