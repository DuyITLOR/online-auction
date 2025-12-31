import {
  sendMessageDto,
  getMessageDto,
  messageDto,
  getAllChatsDto,
  chatsDto,
} from '../dto/chatDto';
import { prisma } from './db/prisma';

export const getAllChats = async (data: getAllChatsDto) => {
  let orders = [] as chatsDto[];
  const sellingProducts = await prisma.orders.findMany({
    where: {
      product: {
        sellerId: data.userId,
      },
    },
    include: {
      product: {
        include: {
          seller: true,
        },
      },
      buyer: true,
    },
  });

  const buyingProducts = await prisma.orders.findMany({
    where: {
      buyerId: data.userId,
    },
    include: {
      product: {
        include: {
          seller: true,
        },
      },
      buyer: true,
    },
  });

  sellingProducts.map((order) => {
    const tmp = {
      id: order.id,
      productId: order.productId,
      productName: order.product.title,
      buyerId: order.buyerId,
      buyerName: order.buyer.fullname,
      buyerAvt: order.buyer.avtUrl,
      sellerId: order.product.sellerId,
      sellerName: order.product.seller.fullname,
      sellerAvt: order.product.seller.avtUrl,
    } as chatsDto;

    orders.push(tmp);
  });

  buyingProducts.map((order) => {
    const tmp = {
      id: order.id,
      productId: order.productId,
      productName: order.product.title,
      buyerId: order.buyerId,
      buyerName: order.buyer.fullname,
      buyerAvt: order.buyer.avtUrl,
      sellerId: order.product.sellerId,
      sellerName: order.product.seller.fullname,
      sellerAvt: order.product.seller.avtUrl,
    } as chatsDto;

    orders.push(tmp);
  });

  return orders;
};

export const getChat = async (data: getMessageDto) => {
  const msgs = await prisma.chat.findMany({
    where: {
      productId: data.productId,
    },
    orderBy: {
      sendAt: 'asc',
    },
    include: {
      sender: true,
    },
  });

  const messages = [] as messageDto[];

  msgs.map((msg) => {
    const data = {
      id: msg.id,
      content: msg.content,
      sendAt: msg.sendAt,
      avtUrl: msg.sender.avtUrl,
      senderId: msg.senderId,
      senderName: msg.sender.fullname,
    } as messageDto;

    messages.push(data);
  });
  return messages;
};

export const createChat = async (data: sendMessageDto) => {
  const record = await prisma.chat.create({
    data: {
      productId: data.productId,
      senderId: data.senderId,
      content: data.content,
    },
    include: {
      sender: true,
    },
  });
  const msg = {
    id: record.id,
    content: data.content,
    sendAt: record.sendAt,
    avtUrl: record.sender.avtUrl,
    senderId: record.senderId,
    senderName: record.sender.fullname,
  } as messageDto;

  return msg;
};
