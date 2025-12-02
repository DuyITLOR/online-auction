import { prisma } from './db/prisma';
import { getAllUsersServiceDto } from '../dto/adminDto';

export const getAllUsers = async (data: getAllUsersServiceDto) => {
  try {
    let users;
    if (data.limit <= 0) {
      users = await prisma.user.findMany();
    } else {
      users = await prisma.user.findMany({
        orderBy: { createdAt: 'asc' }, // hoặc orderBy: { id: 'asc' }
        skip: data.page * data.limit,
        take: data.limit,
      });
    }
    const totalItems = await prisma.user.count();
    let pages = Math.ceil(totalItems / data.limit);
    if (data.limit <= 0) {
      pages = 1;
    }
    return {
      success: true,
      users: {
        users,
        totalPages: pages,
      },
      message: 'Get successful',
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

export const getAllRequest = async (data: getAllUsersServiceDto) => {
  try {
    let requests;
    if (data.limit <= 0) {
      requests = await prisma.upgradeRequests.findMany();
    } else {
      requests = await prisma.upgradeRequests.findMany({
        orderBy: { createdAt: 'asc' }, // hoặc orderBy: { id: 'asc' }
        skip: data.page * data.limit,
        take: data.limit,
      });
    }

    const totalItems = await prisma.upgradeRequests.count();
    let pages = Math.ceil(totalItems / data.limit);
    if (data.limit <= 0) {
      pages = 1;
    }
    return {
      success: true,
      requests: {
        requests,
        totalPages: pages,
      },
      message: 'Get successful',
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

export const acceptRequest = async (id: string) => {
  try {
    const decidedAt = new Date();
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const record = await prisma.upgradeRequests.update({
      where: { id },
      data: {
        status: 'VALID',
        decidedAt,
        expiredAt,
      },
    });

    return {
      success: true,
      data: record,
      message: 'Accept request successfully',
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

export const refuseRequest = async (id: string) => {
  try {
    const record = await prisma.upgradeRequests.update({
      where: {
        id,
      },
      data: {
        status: 'FAILED',
      },
    });
    return {
      success: true,
      data: record,
      message: 'Refuse request successfully',
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
