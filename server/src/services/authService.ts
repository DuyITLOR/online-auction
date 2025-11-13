import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as repo from '../repositories/authRepo';

const JWT_SECRET = process.env.JWT_SECRET;

export const hashPassword = async (password: string) => {
  const saltRound = 5;
  const hashed = await bcrypt.hash(password, saltRound);
  return hashed;
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export const getBidder = async (email: string) => {
  return await repo.getUserByEmail(email);
};

export const generateToken = async (id: string, email: string) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return token;
};

export const checkExistEmail = async (email: string) => {
  const user = await repo.getUserByEmail(email);
  return user ? true : false;
};

export const addNewBidder = async (
  email: string,
  fullname: string,
  password: string
) => {
  try {
    const user = await repo.addBidder(email, fullname, password);
    return {
      success: true,
      message: user.id,
      bidder: user,
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

export const updateUser = async (
  email: string,
  fullname: string,
  passwordHashed: string
) => {
  try {
    await repo.updateUser(email, fullname, passwordHashed);
    return true;
  } catch (err) {
    console.log(err);
    return false;
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

export const verifyCode = async (code: string, email: string) => {
  const infor = await repo.getVerification(email);
  const now = new Date();
  if (!infor?.expiresAt) {
    return {
      success: false,
      message: 'Lost expiration',
    };
  }
  if (now > infor.expiresAt) {
    await repo.updateVerificationFailed(infor.id);
    return {
      success: false,
      message: 'expired code',
    };
  }
  if (code === infor.code) {
    await repo.updateVerificationSuccess(infor.id);
    return {
      success: true,
      message: 'Valid code',
    };
  }
  return {
    success: false,
    message: 'Unvalid code',
  };
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
