

import { prisma } from '../services/db/prisma';

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const addBidder = async (
  email: string,
  fullname: string,
  password: string
) => {
  const user = await prisma.user.create({
    data: {
      email,
      fullname,
      password,
      role: 'BIDDER',
      ratingPos: 0,
      ratingNeg: 0,
    },
  });
  return user;
};

export const createEmailVerification = async (email: string, code: string) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.emailVerification.updateMany({
    where: {
      email,
      status: 'NOTYET',
    },
    data: {
      status: 'FAILED',
    },
  });

  const record = await prisma.emailVerification.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });
  return record;
};

export const updateVerificationFailed = async (id: string) => {
  await prisma.emailVerification.update({
    where: {
      id,
    },
    data: {
      status: 'FAILED',
    },
  });
};

export const updateVerificationSuccess = async (id: string) => {
  await prisma.emailVerification.update({
    where: {
      id,
    },
    data: {
      status: 'SUCCESS',
    },
  });
};

export const getVerification = async (email: string) => {
  const record = await prisma.emailVerification.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
  return record;
};

export const updateUser = async (
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
