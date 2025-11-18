import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from './db/prisma';
import { emailVerificationDto } from '../dto/authenticationDto';

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
    expiresIn: '1h',
  });
  return token;
};

export const checkExistEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  return user ? true : false;
};

export const addNewBidder = async (
  email: string,
  fullname: string,
  password: string,
  avtUrl: string
) => {
  try {
    const user = await addBidder(email, fullname, password, avtUrl);
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

// export const updateUser = async (
//   email: string,
//   fullname: string,
//   passwordHashed: string
// ) => {
//   try {
//     await updateUser(email, fullname, passwordHashed);
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };

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
    where: { email },
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

// export const createEmailVerification = async (email: string, code: string) => {
//   const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

//   await prisma.emailVerification.updateMany({
//     where: {
//       email,
//       status: 'NOTYET',
//     },
//     data: {
//       status: 'FAILED',
//     },
//   });

//   const record = await prisma.emailVerification.create({
//     data: {
//       email,
//       code,
//       expiresAt,
//     },
//   });
//   return record;
// };

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

const updateUser = async (
  email: string,
  fullname: string,
  password: string
) => {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      fullname,
      password,
    },
  });
};
