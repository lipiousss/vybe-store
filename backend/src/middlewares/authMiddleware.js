import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const jwtSecret = process.env.JWT_SECRET || 'vybe-store-development-secret';

function stripPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'User is not authorized.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Аккаунт заблокирован' });
    }

    req.user = stripPassword(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization token is invalid.' });
  }
}
