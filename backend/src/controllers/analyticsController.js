import { prisma } from '../config/prisma.js';

function toNumber(value) {
  return Number(value || 0);
}

function toMoney(value) {
  return Number(toNumber(value).toFixed(2));
}

function primaryImage(product) {
  return product?.images?.[0]?.url || null;
}

export async function getAnalyticsOverview(req, res, next) {
  try {
    const [
      revenueAggregate,
      totalOrders,
      totalUsers,
      totalProducts,
      lowStockCount,
      outOfStockCount,
      collectibleProductsCount,
      activeProductsCount,
      cancelledOrdersCount,
      deliveredOrdersCount,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { totalPrice: true },
      }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.productVariant.count({ where: { stock: { gt: 0, lte: 5 } } }),
      prisma.productVariant.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { isCollectible: true } }),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
    ]);

    const totalRevenue = toMoney(revenueAggregate._sum.totalPrice);
    const averageOrderValue = totalOrders > 0 ? toMoney(totalRevenue / totalOrders) : 0;

    return res.json({
      overview: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        averageOrderValue,
        lowStockCount,
        outOfStockCount,
        collectibleProductsCount,
        activeProductsCount,
        cancelledOrdersCount,
        deliveredOrdersCount,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRecentOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        _count: {
          select: { items: true },
        },
      },
    });

    return res.json({
      orders: orders.map((order) => ({
        ...order,
        totalPrice: toMoney(order.totalPrice),
        itemsCount: order._count.items,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getLowStock(req, res, next) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      take: 20,
      orderBy: { stock: 'asc' },
      include: {
        product: {
          include: {
            category: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
      },
    });

    return res.json({
      variants: variants.map((variant) => ({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        stock: variant.stock,
        status: variant.stock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        product: {
          id: variant.product.id,
          name: variant.product.name,
          image: primaryImage(variant.product),
          status: variant.product.status,
        },
        category: variant.product.category?.name || null,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTopProducts(req, res, next) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          status: { not: 'CANCELLED' },
        },
      },
      include: {
        product: {
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            category: true,
          },
        },
      },
    });

    const grouped = new Map();

    for (const item of orderItems) {
      const current = grouped.get(item.productId) || {
        productId: item.productId,
        product: item.product,
        soldQuantity: 0,
        revenue: 0,
      };

      current.soldQuantity += item.quantity;
      current.revenue += item.quantity * toNumber(item.price);
      grouped.set(item.productId, current);
    }

    const products = Array.from(grouped.values())
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 8)
      .map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: primaryImage(item.product),
        category: item.product.category?.name || null,
        soldQuantity: item.soldQuantity,
        revenue: toMoney(item.revenue),
      }));

    return res.json({ products });
  } catch (error) {
    return next(error);
  }
}

export async function getStockMovements(req, res, next) {
  try {
    const movements = await prisma.stockMovement.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
        productVariant: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    return res.json({
      movements: movements.map((movement) => ({
        id: movement.id,
        type: movement.type,
        quantity: movement.quantity,
        comment: movement.comment,
        createdAt: movement.createdAt,
        createdBy: movement.createdBy,
        variant: {
          id: movement.productVariant.id,
          size: movement.productVariant.size,
          color: movement.productVariant.color,
          sku: movement.productVariant.sku,
          stock: movement.productVariant.stock,
        },
        product: {
          id: movement.productVariant.product.id,
          name: movement.productVariant.product.name,
          image: primaryImage(movement.productVariant.product),
        },
      })),
    });
  } catch (error) {
    return next(error);
  }
}
