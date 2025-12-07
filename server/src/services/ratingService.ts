import { prisma } from './db/prisma';
import {
  ratingDto,
  updateRatingDto,
  getRatingDto,
  deleteRatingDto,
} from '../dto/ratingDto';

export const getAllRatings = async (data: getRatingDto) => {
  const skip = (data.page - 1) * data.limit;

  let whereCondition: any = {};

  if (data.type === 'received') {
    whereCondition = { rateeId: data.userId };
  } else if (data.type === 'given') {
    whereCondition = { raterId: data.userId };
  } else {
    whereCondition = {
      OR: [{ rateeId: data.userId }, { raterId: data.userId }],
    };
  }

  const [ratings, totalItem] = await Promise.all([
    prisma.ratings.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc', 
      },
      skip,
      take: data.limit,
      include: {
        ratee: true,
        rater: true,
      },
    }),

    prisma.ratings.count({
      where: whereCondition,
    }),
  ]);

  return {
    page: data.page,
    limit: data.limit,
    totalItem,
    totalPage: Math.ceil(totalItem / data.limit),
    ratings,
  };
};

export const createRating = async (data: ratingDto) => {
  const existCount = await prisma.ratings.count({
    where: {
      raterId: data.raterId,
      rateeId: data.rateeId,
      productId: data.productId,
    },
  });

  if (existCount > 0) {
    throw new Error('Bạn đã đánh giá người này rồi');
  }

  return await prisma.ratings.create({
    data: {
      raterId: data.raterId,
      rateeId: data.rateeId,
      productId: data.productId,
      value: data.value,
      comment: data.comment,
    },
    include: {
      ratee: { select: { fullname: true } },
      product: { select: { title: true } },
    },
  });
};

export const updateRating = async (Data: updateRatingDto) => {
  const { id, value, comment } = Data;

  const rating = await prisma.ratings.findUnique({ where: { id } });

  if (!rating) throw new Error('Rating không tồn tại');

  const data = {
    value: value === undefined ? rating.value : Number(value),
    comment: comment === undefined ? rating.comment : comment,
  };

  return prisma.ratings.update({
    where: { id },
    data,
  });
};

export const deleteRating = async (data: deleteRatingDto) => {
  const userId = data.userId;
  const ratingId = data.ratingId;
  const check = await prisma.ratings.findUnique({
    where: {
      id: ratingId,
      raterId: userId,
    },
  });
  if (check === null) {
    throw new Error('Bạn không đủ thẩm quyền để xóa đánh giá này');
  }
  return await prisma.ratings.delete({
    where: {
      id: ratingId,
    },
  });
};
