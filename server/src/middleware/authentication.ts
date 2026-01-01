// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../services/db/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

// Định nghĩa kiểu payload trong JWT
export interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as JwtPayloadCustom;
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return {
        valid: true,
        expired: true,
      };
    }
    return {
      valid: false,
      expired: false,
    };
  }
};

// Middleware xác thực JWT
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // verify token, ép kiểu cẩn thận để TypeScript không cảnh báo
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as JwtPayloadCustom;

    // Kiểm tra payload hợp lệ
    if (!decoded || !decoded.id || !decoded.email) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Gắn payload vào req.user để route handler có thể dùng
    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn' });
    }
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
