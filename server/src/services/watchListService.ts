import {
  addWatchListDto,
  getWatchListDto,
  removeWatchListDto,
} from '../dto/watchListDto';
import { prisma } from './db/prisma';

export const addWatchList = async (userId: string, data: addWatchListDto) => {
  const watchList = await prisma.watchList.create({
    data: {
      userId: userId,
      productId: data.productId,
    },
  });

  return watchList;
};

export const removeWatchList = async (
  userId: string,
  data: removeWatchListDto
) => {
  const watchList = await prisma.watchList.deleteMany({
    where: {
      userId: userId,
      productId: data.productId,
    },
  });

  return watchList;
};

export const getWatchList = async (userId: string, query: getWatchListDto) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await prisma.watchList.findMany({
    skip,
    take: limit,
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          seller: true,
          bidHistory: {
            orderBy: { amount: 'desc' },
            take: 1,
            include: {
              bidder: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.watchList.count({
    where: {
      userId: userId,
    },
  });

  return {
    data,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCountWatchListOfUser = async (userId: string) => {
  if (!userId) throw new Error('Cần ID người dùng');
  const count = await prisma.watchList.count({
    where: {
      userId: userId,
    },
  });

  return count;
};
export const getAllWatchList = async (userId: string) => {
  const data = await prisma.watchList.findMany({
    where: {
      userId: userId,
      product: {
        endAt: {
          gt: new Date(),
        },
      },
    },
    orderBy: { createAt: 'desc' },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          seller: true,
          bidHistory: {
            orderBy: { amount: 'desc' },
            take: 1,
            include: {
              bidder: true,
            },
          },
        },
      },
    },
  });

  return {
    data,
  };
};
