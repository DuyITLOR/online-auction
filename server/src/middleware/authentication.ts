// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

// Định nghĩa kiểu payload trong JWT
export interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
}

// Mở rộng interface Request của Express để thêm trường `user`
// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayloadCustom;
//     }
//   }
// }

// Middleware xác thực JWT
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
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
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Gắn payload vào req.user để route handler có thể dùng
    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};


