import { prisma } from '../services/db/prisma';

export const checkRole = async (id: string) => {
  let roles = [];
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (user?.role) roles.push(user?.role);

  const requests = await prisma.upgradeRequests.findMany({
    where: {
      userId: id,
    }
  });
  const now = new Date();
  for (const request of requests) {
    if (request.status === 'VALID' && request.expiredAt !== null && now < request.expiredAt!) {
      roles.push('SELLER');
      break;
    }
  }
  console.log(roles);
  return roles;
};

