import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidUsername,
} from '../utils/validators.js';

function stripPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function toSafeProfileResponse(user) {
  return {
    user: stripPassword(user),
    profile: user.profile || null,
    addresses: user.addresses || [],
    stats: {
      favorites: user._count?.favorites || 0,
      orders: user._count?.orders || 0,
    },
  };
}

async function getProfilePayload(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      addresses: true,
      _count: {
        select: {
          favorites: true,
          orders: true,
        },
      },
    },
  });

  if (!user) {
    throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  }

  return toSafeProfileResponse(user);
}

export async function getProfile(req, res, next) {
  try {
    const profile = await getProfilePayload(req.user.id);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const {
      username,
      firstName,
      lastName,
      bio,
      birthDate,
    } = req.body;

    if (username !== undefined && !isValidUsername(username)) {
      return res.status(400).json({
        message: 'Username must be 3-20 characters and contain only latin letters, numbers, and underscores.',
      });
    }

    if (username !== undefined) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username.trim(),
          NOT: { id: req.user.id },
        },
      });

      if (existingUser) {
        return res.status(409).json({ message: 'Username is already taken.' });
      }
    }

    const parsedBirthDate = birthDate ? new Date(birthDate) : null;

    if (birthDate && Number.isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({ message: 'Birth date is invalid.' });
    }

    await prisma.$transaction(async (tx) => {
      if (username !== undefined) {
        await tx.user.update({
          where: { id: req.user.id },
          data: { username: username.trim() },
        });
      }

      await tx.userProfile.upsert({
        where: { userId: req.user.id },
        update: {
          firstName: firstName === undefined ? undefined : firstName || null,
          lastName: lastName === undefined ? undefined : lastName || null,
          bio: bio === undefined ? undefined : bio || null,
          birthDate: birthDate === undefined ? undefined : parsedBirthDate,
        },
        create: {
          userId: req.user.id,
          firstName: firstName || null,
          lastName: lastName || null,
          bio: bio || null,
          birthDate: parsedBirthDate,
        },
      });
    });

    const profile = await getProfilePayload(req.user.id);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isCurrentPasswordValid = user && await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is invalid.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: passwordHash },
    });

    return res.json({ message: 'Password changed.' });
  } catch (error) {
    return next(error);
  }
}

export async function changeEmail(req, res, next) {
  try {
    const { newEmail, password } = req.body;

    if (!isValidEmail(newEmail) || !password) {
      return res.status(400).json({ message: 'Valid new email and password are required.' });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: { id: req.user.id },
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already taken.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is invalid.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { email: normalizedEmail },
    });

    return res.json({ user: stripPassword(updatedUser) });
  } catch (error) {
    return next(error);
  }
}

export async function updatePhone(req, res, next) {
  try {
    const { phone } = req.body;

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Phone format must be +7 (999) 999-99-99.' });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { phone: phone || null },
    });

    return res.json({ user: stripPassword(user) });
  } catch (error) {
    return next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar file is required.' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarPath },
    });

    return res.json({ user: stripPassword(user) });
  } catch (error) {
    return next(error);
  }
}
