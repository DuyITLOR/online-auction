import { Server, Socket } from 'socket.io';
import { gatewayResponse } from './utils/response';
import { HttpStatus } from './utils/permission';
import { verifyToken } from './middleware/authentication';
import { prisma } from './services/db/prisma';

interface sendMessageDto {
  productId: string;
  senderId: string;
  content: string;
}

export function setupSocket(io: Server) {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Authentication token is required'
      );
      return next(new Error(JSON.stringify(response)));
    }
    const verificationResult = verifyToken(token);
    if (!verificationResult.valid) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        verificationResult.expired ? 'Token đã hết hạn' : 'Token không hợp lệ'
      );
      return next(new Error(JSON.stringify(response)));
    }
    socket.data.userId = verificationResult.decoded?.id;
    socket.data.email = verificationResult.decoded?.email;
    next();
  });

  io.on('connection', (socket: Socket) => {
    socket.on('subscribe', (productList: string[]) => {
      for (const id of productList) {
        socket.join(`chat/${id}`);
      }
    });

    socket.on('send_message', async (data: sendMessageDto) => {
      // Store message to DB
      const msg = await prisma.chat.create({
        data: {
          productId: data.productId,
          senderId: data.senderId,
          content: data.content,
          sendAt: new Date(),
        },
        select: {
          id: true,
          senderId: true,
          productId: true,
          content: true,
          sendAt: true,
          sender: {
            select: {
              fullname: true,
              avtUrl: true,
            },
          },
        },
      });
      console.log(msg);
      io.to(`chat/${data.productId}`).emit(`chat/${data.productId}`, msg);
    });
  });
}
