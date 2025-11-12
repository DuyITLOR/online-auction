import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
