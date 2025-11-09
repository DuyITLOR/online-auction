import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as repo from '../repositories/authRepo';
import { sendEmail } from '../utils/sendEmail';

const JWT_SECRET = process.env.JWT_SECRET;

type verifyResult = {
  success: boolean;
  message: string;
};

const hashPassword = async (password: string) => {
  const saltRound = 5;
  const hashed = await bcrypt.hash(password, saltRound);
  return hashed;
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export const generateToken = async (email: string, password: string) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const hashed = await hashPassword(password);
  const token = jwt.sign(
    { email, hashed },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' } // token hết hạn sau 15 phút
  );
  return token;
};

export const checkExistEmail = async (email: string) => {
  const user = await repo.getUserByEmail(email);
  return user ? true : false;
};

export const addNewBidder = async (
  email: string,
  password: string,
  fullname: string
) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const hashed = await hashPassword(password);
  try {
    const user = await repo.addBidder(email, hashed, fullname);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return {
      success: true,
      token: token,
      message: 'Create new user',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: false,
      message: 'unknown error',
    };
  }
};

export const addEmailVerification = async (code: string, email: string) => {
  try {
    const infor = await repo.createEmailVerification(email, code);
    return {
      success: true,
      message: 'create varification',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: false,
      message: 'unknown error',
    };
  }
};

export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}
