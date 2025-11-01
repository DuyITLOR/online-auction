import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }