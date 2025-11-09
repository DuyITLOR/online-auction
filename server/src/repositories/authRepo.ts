import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const addBidder = async (
  email: string,
  password: string,
  fullname: string
) => {
  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      password,
      role: 'BIDDER',
      ratingPos: 0,
      ratingNeg: 0,
    },
  });
  return user;
};

export const createEmailVerification = async(email: string, code: string) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const record = await prisma.emailVerification.create({
    data: {
      email,
      code,
      expiresAt,
      status: 'NOTYET',
    },
  });

  return record;
}