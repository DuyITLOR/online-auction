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

export const getReceivedRatings = async (userId: string) => {
  try {
    return await prisma.ratings.findMany({
      where: {
        rateeId: userId,
      },
    });
  } catch (err) {
    throw err;
  }
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
  if (data.value === 1) {
    await prisma.user.update({
      where: {
        id: data.rateeId,
      },
      data: {
        ratingPos: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: data.rateeId,
      },
      data: {
        ratingNeg: {
          increment: 1,
        },
      },
    });
  }

  await prisma.orders.update({
    where: {
      id: data.orderId,
      productId: data.productId,   
    },
    data: {
      status : 'COMPLETED',
    }
  })

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

  const user = await prisma.user.findUnique({
    where: {
      id: rating.rateeId,
    },
  });

  if (!user) throw new Error('Server gặp vấn đề');

  if (value !== undefined && Number(value) !== rating.value) {
    const newValue = Number(value);
    if (newValue == 1) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ratingNeg: {
            decrement: 1,
          },
          ratingPos: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ratingNeg: {
            increment: 1,
          },
          ratingPos: {
            decrement: 1,
          },
        },
      });
    }
  }

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

  if (check.value === 1) {
    await prisma.user.update({
      where: {
        id: check.rateeId,
      },
      data: {
        ratingPos: {
          decrement: 1,
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: check.rateeId,
      },
      data: {
        ratingNeg: {
          decrement: 1,
        },
      },
    });
  }
  return await prisma.ratings.delete({
    where: {
      id: ratingId,
    },
  });
};
