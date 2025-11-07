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
