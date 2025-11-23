import { prisma } from './db/prisma';
import { updateUserDto } from '../dto/userDto';

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
