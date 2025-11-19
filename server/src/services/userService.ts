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
    console.error('Error from userService: ', err);
    return {
      success: false,
    };
  }
};

export const updateUser = async (id: string, Data: updateUserDto) => {
  console.log('hello from user');
};
