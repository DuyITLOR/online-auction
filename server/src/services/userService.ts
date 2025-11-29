import { prisma } from './db/prisma';
import { blockUserDto, updateUserDto } from '../dto/userDto';

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
