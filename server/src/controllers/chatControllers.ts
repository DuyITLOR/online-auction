import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';
import type {
  getAllChatsDto,
  getMessageDto,
  sendMessageDto,
} from '../dto/chatDto';
import * as services from '../services/chatService';

export const getAllChats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('Thiếu thông tin');
    }
    const userId = req.user.id;
    const data = {
      userId,
    } as getAllChatsDto;
    const chats = await services.getAllChats(data);

    const response = gatewayResponse(
      HttpStatus.ok,
      chats,
      `Lấy tất cả cuộc hội thoại thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      // console.log('From chat controller: ', err.message);
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        err.message
      );
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        'Lỗi từ server'
      );
      res.status(response.code).send(response);
    }
  }
};

export const getAllMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('Thiếu thông tin');
    }
    const userId = req.user.id;
    const productId = req.params.productId;
    const roles = await checkRole(userId);
    if (!roles.includes('BIDDER') && !roles.includes('ADMIN')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bạn không có đủ quyền để truy cập'
      );
      res.status(response.code).send(response);
      return;
    }

    const data = {
      productId: productId,
    } as getMessageDto;
    const messages = await services.getChat(data);
    const response = gatewayResponse(
      HttpStatus.created,
      messages,
      `Lấy đoạn chat thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      // console.log('From chat controller: ', err.message);
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        err.message
      );
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        'Lỗi từ server'
      );
      res.status(response.code).send(response);
    }
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error('Thiếu thông tin');
    }
    const senderId = req.user.id;
    const productId = req.params.productId;
    const content = req.body.content;
    if (!senderId || !productId || !content) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Thiếu thông tin'
      );
      return res.status(response.code).send(response);
    }
    const roles = await checkRole(senderId);
    if (!roles.includes('BIDDER') && !roles.includes('ADMIN')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bạn không có đủ quyền để truy cập'
      );
      res.status(response.code).send(response);
      return;
    }
    const data = {
      senderId: senderId,
      productId: productId,
      content: content,
    } as sendMessageDto;
    const mesg = await services.createChat(data);
    const response = gatewayResponse(
      HttpStatus.created,
      mesg,
      `Nhắn tin thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      // console.log('From chat controller: ', err.message);
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        err.message
      );
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        'Lỗi từ server'
      );
      res.status(response.code).send(response);
    }
  }
};
