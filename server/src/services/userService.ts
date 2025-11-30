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


export const checkRating = async (id: string) => {
  console.log("Checking rating for user:", id);
  const user = await prisma.user.findUnique({
    where: {id},
  })

  if (!user) throw new Error("User not found");
  const total = user.ratingNeg + user.ratingPos;
  // console.log("positive ratings:", user.ratingPos);
  // console.log("negative ratings:", user.ratingNeg);
  // console.log("total ratings:", total);
  if (total === 0) return false;

  if ( (user.ratingPos / total)  >= 0.8){
    return true;
  } 
  return false;
}
