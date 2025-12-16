import { sendMessageDto, getMessageDto } from '../dto/chatDto';
import { prisma } from './db/prisma';

export const getChat = async (data: getMessageDto) => {
  return await prisma.chat.findMany({
    where: {
      productId: data.productId,
    },
    orderBy: {
      sendAt: 'desc',
    },
  });
};

export const createChat = async (data: sendMessageDto) => {
  return await prisma.chat.create({
    data: {
      productId: data.productId,
      senderId: data.senderId,
      content: data.content,
    },
  });
};
