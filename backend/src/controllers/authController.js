import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { generateToken } from '../utils/generateToken.js';
import { validateRegisterInput, isValidEmail } from '../utils/validators.js';

function stripPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function register(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const errors = validateRegisterInput({ email, username, password });

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedUsername },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or username is already taken.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        password: passwordHash,
        role: 'USER',
        cart: {
          create: {},
        },
      },
      include: {
        cart: true,
      },
    });

    return res.status(201).json({
      user: stripPassword(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || user.isBlocked) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.json({
      user: stripPassword(user),
      token: generateToken(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        addresses: true,
        cart: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: stripPassword(user) });
  } catch (error) {
    return next(error);
  }
}
