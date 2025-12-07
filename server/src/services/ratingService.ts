import { prisma } from './db/prisma';
import { ratingDto, updateRatingDto, getRatingDto } from '../dto/ratingDto';

export const getAllRatings = async (data: getRatingDto) => {
  let ratings = [];
  const rater = await prisma.ratings.findMany({
    where: {
      raterId: data.userId,
    },
    include: {
      ratee: true,
      rater: true,
    },
  });
  const ratee = await prisma.ratings.findMany({
    where: {
      rateeId: data.userId,
    },
    include: {
      ratee: true,
      rater: true,
    },
  });
  if (data.type === 'all') {
    ratings = [...rater, ...ratee];
  } else if (data.type === 'received') {
    ratings = [...ratee];
  } else {
    ratings = [...rater];
  }
  return ratings;
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
