import { prisma } from '../config/prisma.js';

const userSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  avatar: true,
  phone: true,
  isBlocked: true,
  createdAt: true,
  profile: true,
  _count: {
    select: {
      orders: true,
      favorites: true,
    },
  },
};

function buildUsersWhere(query) {
  const where = {};

  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: 'insensitive' } },
      { username: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.isBlocked !== undefined) {
    where.isBlocked = query.isBlocked === true || query.isBlocked === 'true';
  }

  return where;
}

function formatUser(user) {
  const { _count, ...safeUser } = user;
  return {
    ...safeUser,
    counts: {
      orders: _count?.orders || 0,
      favorites: _count?.favorites || 0,
    },
  };
}

export async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: buildUsersWhere(req.query),
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ users: users.map(formatUser) });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...userSelect,
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { order: 'asc' } },
                  },
                },
                variant: true,
              },
            },
          },
        },
        favorites: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' } },
                category: true,
                collection: true,
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { _count, ...safeUser } = user;
    return res.json({
      user: {
        ...safeUser,
        counts: {
          orders: _count.orders,
          favorites: _count.favorites,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Role must be USER or ADMIN.' });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!target) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (target.id === req.user.id && target.role === 'ADMIN' && role !== 'ADMIN') {
      const adminsCount = await prisma.user.count({ where: { role: 'ADMIN' } });

      if (adminsCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove the last admin role from yourself.' });
      }
    }

    const user = await prisma.user.update({
      where: { id: target.id },
      data: { role },
      select: userSelect,
    });

    return res.json({ user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserBlock(req, res, next) {
  try {
    if (typeof req.body.isBlocked !== 'boolean') {
      return res.status(400).json({ message: 'isBlocked must be boolean.' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot block yourself.' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: req.body.isBlocked },
      select: userSelect,
    });

    return res.json({ user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
}
