import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'vybe-store-development-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
}
