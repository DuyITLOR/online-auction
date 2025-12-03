import { prisma } from './db/prisma';
import {
  blockUserDto,
  updateUserDto,
  askSellerDto,
  askSellerReturnDto,
  answerBidderDto,
  answerBidderReturnDto,
  returnErrorDto,
} from '../dto/userDto';

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return {
      success: true,
      user: user,
    };
  } catch (err) {
    console.error('Error from userService:', err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const updateUser = async (id: string, Data: updateUserDto) => {
  try {
    const { fullname, avtUrl } = Data;
    const data = {
      ...(fullname !== undefined && { fullname }),
      ...(avtUrl !== undefined && { avtUrl }),
    };

    const updated = await prisma.user.update({
      where: { id },
      data: data,
    });
    return {
      success: true,
      data: updated,
      message: 'Update successful',
    };
  } catch (err) {
    console.error('Error from userService:', err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const upgradeUser = async (id: string, note: string) => {
  try {
    const record = await prisma.upgradeRequests.create({
      data: {
        userId: id,
        note,
      },
    });
    return {
      success: true,
      data: record,
      message: 'Request successfully',
    };
  } catch (err) {
    console.error('Error from userService:', err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const checkRating = async (id: string) => {
  console.log('Checking rating for user:', id);
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) throw new Error('User not found');
  const total = user.ratingNeg + user.ratingPos;
  // console.log("positive ratings:", user.ratingPos);
  // console.log("negative ratings:", user.ratingNeg);
  // console.log("total ratings:", total);
  if (total === 0) return false;

  if (user.ratingPos / total >= 0.8) {
    return true;
  }
  return false;
};

export const getAllBlockedUser = async (productId: string) => {
  try {
    const record = await prisma.blockedBidders.findMany({
      where: {
        productId,
      },
    });
    return {
      success: true,
      data: record,
      message: 'Get successfully',
    };
  } catch (err) {
    console.error('Error from userService:', err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const getBlockUserByProductId = async (
  productId: string
): Promise<string[]> => {
  try {
    const record = await prisma.blockedBidders.findMany({
      where: { productId },
      select: { userId: true },
    });

    return record.map((r) => r.userId);
  } catch (err) {
    console.error('Error from userService:', err);
    return [];
  }
};

export const blockUser = async (data: blockUserDto) => {
  try {
    const check = await prisma.blockedBidders.findUnique({
      where: {
        productId_userId: {
          productId: data.productId,
          userId: data.userId,
        },
      },
    });
    if (check) {
      return {
        success: true,
        data: check,
        message: 'Already blocked',
      };
    }
    const record = await prisma.blockedBidders.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        reason: data.reason,
      },
    });
    return {
      success: true,
      data: record,
      message: 'Blocked successfully',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const askSeller = async (
  data: askSellerDto
): Promise<askSellerReturnDto | returnErrorDto> => {
  try {
    const record = await prisma.comments.create({
      data: {
        productId: data.productId,
        senderId: data.senderId,
        parentId: null,
        content: data.question,
      },
      include: {
        product: {
          select: {
            title: true,
            seller: {
              select: {
                email: true,
              },
            },
          },
        },
        sender: {
          select: {
            email: true,
          },
        },
      },
    });
    return {
      success: true,
      productName: record.product.title,
      sellerEmail: record.product.seller.email,
      askerEmail: record.sender.email,
      question: record.content,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const answerBidder = async (
  data: answerBidderDto
): Promise<answerBidderReturnDto | returnErrorDto> => {
  try {
    const record = await prisma.comments.create({
      data: {
        productId: data.productId,
        senderId: data.sellerId,
        parentId: data.commentId,
        content: data.answer,
      },
      include: {
        product: {
          select: {
            title: true,
          },
        },
        parent: {
          select: {
            sender: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    if (record.parent === null) {
      throw new Error('Câu hỏi không tồn tại');
    }
    return {
      success: true,
      bidderEmail: record.parent.sender.email,
      productName: record.product.title,
      answer: data.answer,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};

export const getAllCommentsByProductId = async (productId: string) => {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        productId,
      },
    });
    return {
      success: true,
      data: comments,
      message: 'Get comments successfully',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
};
