import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from './db/prisma';
import {
  emailVerificationDto,
  profileDto,
  verifyDto,
} from '../dto/authenticationDto';

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
  return await getUserByEmail(email);
};

export const generateToken = async (id: string, email: string) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
  return token;
};

export const checkExistEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  return user ? true : false;
};

export const addNewBidder = async (data: verifyDto) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        fullname: data.fullname,
        password: data.hashed,
        role: 'BIDDER',
        avtUrl: data.avtUrl,
        ratingNeg: 0,
        ratingPos: 0,
      },
    });
    return {
      success: true,
      message: 'Tạo tài khoản thành công',
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

export const addEmailVerification = async (data: emailVerificationDto) => {
  try {
    await prisma.emailVerification.create({
      data: {
        email: data.email,
        code: data.code,
        expiresAt: data.expiresAt,
      },
    });
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
  const infor = await prisma.emailVerification.findFirst({
    where: { email, status: 'NOTYET' },
    orderBy: { createdAt: 'desc' },
  });
  const now = new Date();
  if (!infor?.expiresAt) {
    return {
      success: false,
      message: 'Lost expiration',
    };
  }
  if (now > infor.expiresAt) {
    await updateVerificationFailed(infor.id);
    return {
      success: false,
      message: 'expired code',
    };
  }
  if (code === infor.code) {
    await updateVerificationSuccess(infor.id);
    return {
      success: true,
      message: 'Valid code',
    };
  }
  return {
    success: false,
    message: 'Invalid code',
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

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const addBidder = async (
  email: string,
  fullname: string,
  password: string,
  avtUrl: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      fullname,
      password,
      avtUrl,
      role: 'BIDDER',
      ratingPos: 0,
      ratingNeg: 0,
    },
  });
  return user;
};

const updateVerificationFailed = async (id: string) => {
  await prisma.emailVerification.update({
    where: {
      id,
    },
    data: {
      status: 'FAILED',
    },
  });
};

const updateVerificationSuccess = async (id: string) => {
  await prisma.emailVerification.update({
    where: {
      id,
    },
    data: {
      status: 'SUCCESS',
    },
  });
};

const getVerification = async (email: string) => {
  const record = await prisma.emailVerification.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
  return record;
};

export const signInWithGoogle = async (profile: profileDto) => {
  const email = profile.email;
  const avtUrl = profile.avtUrl;
  let bidder = await getBidder(email);
  if (!bidder) {
    const code = generateCode(); // Gen temporary password
    const hashed = await hashPassword(code);
    bidder = await addBidder(email, profile.fullname, hashed, avtUrl);
  }

  const token = await generateToken(bidder.id, bidder.email);

  return {
    bidder,
    token,
  };
};

export const updatePassword = async (id: string, password: string) => {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
    return {
      success: true,
      message: 'Update password',
    };
  } catch (err) {
    console.error('Error from userService:', err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};
