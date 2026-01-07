import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/userService';
import { uploadSingleFile } from '../utils/uploadImage';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';
import {
  loadAskTemplate,
  loadAnswerTemplate,
  loadBlockedBidderTemplate,
  sendEmail,
} from '../utils/sendEmail';
import {
  blockBidderDto,
  deleteCommentDto,
  getALlCommentsDto,
  updateUserDto,
} from '../dto/userDto';
import { getCompletedOrder } from '../services/orderService';
import { getReceivedRatings } from '../services/ratingService';

export const getUserById = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(400, null, 'Token không hợp lệ');
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  const roles = await checkRole(id);
  const record = await service.getUserById(id);
  if (record.success) {
    const newUser = {
      ...record.user,
      currentRoles: roles,
    };
    const response = gatewayResponse(
      200,
      {
        user: newUser,
      },
      'Lấy thông tin người dùng'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(400, null, 'Yêu cầu không hợp lệ');
    res.status(response.code).send(response);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await service.getUserInformation(id);
  if (user.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      user.user,
      'Lấy thông tin người dùng thành công'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Yêu cầu không hợp lệ'
    );
    res.status(response.code).send(response);
  }
};

export const getSellerStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Cần token trước khi yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }
    const userId = req.user.id;
    const products = await service.getActivedProducts(userId);
    const orders = await getCompletedOrder(userId);
    const ratings = await getReceivedRatings(userId);
    const revenue = orders.reduce(
      (total, order) => total + order.totalAmount.toNumber(),
      0
    );

    const posRatings = ratings.filter((rating) => rating.value === 1).length;
    let ratingValue = (posRatings / (ratings.length || 1)) * 100;
    if (ratings.length === 0) {
      ratingValue = 100;
    }
    const data = {
      products: products,
      orders: orders,
      revenue: revenue,
      ratingValue: ratingValue.toFixed(2),
    };

    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      'Lấy dữ liệu thành công'
    );

    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      const response = gatewayResponse(
        HttpStatus.serviceUnavailable,
        null,
        err.message
      );
      res.status(response.code).send(response);
    }
    const response = gatewayResponse(
      HttpStatus.serviceUnavailable,
      null,
      'Lỗi từ server'
    );
    res.status(response.code).send(response);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
    });
  }

  const avt = await uploadSingleFile(req, 'avatar');
  const avtUrl = avt.fileUrl;
  const fullname = req.body.fullname;
  const dateOfBirth = req.body.dateOfBirth;
  const address = req.body.address;
  const data = {
    fullname: fullname,
    dateOfBirth: dateOfBirth,
    address: address,
    avtUrl: avtUrl,
  } as updateUserDto;

  const record = await service.updateUser(req.user.id, data);
  if (record.success) {
    const response = gatewayResponse(
      200,
      null,
      'Cập nhật người dùng thành công'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(400, null, 'Yêu cầu không hợp lệ');
    res.status(response.code).send(response);
  }
};

export const requestUpgrade = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Need token before requesting'
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes('BIDDER')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'You do not have permission for requesting'
    );
    res.status(response.code).send(response);
    return;
  }
  //
  const note = req.body.note ?? '';
  const record = await service.upgradeUser(id, note);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.accepted,
      {
        record: record.data,
      },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const getAllBlockedUser = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Need token before requesting'
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes('SELLER') && !roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'You do not have permission for requesting'
    );
    res.status(response.code).send(response);
    return;
  }
  const productId = req.params.productId;
  const record = await service.getAllBlockedUser(productId);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      {
        blocked_list: record.data,
      },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const blockBidder = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      "Need token before requesting"
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes("SELLER")) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      "You do not have permission for requesting"
    );
    res.status(response.code).send(response);
    return;
  }
  const blockedUserId = req.params.userId;
  const productId = req.body.productId;
  const reason = req.body.reason;
  const data = {
    productId: productId,
    userId: blockedUserId,
    reason: reason,
  };
  const record: blockBidderDto = await service.blockUser(data);
  if (record.success) {
    const content = loadBlockedBidderTemplate(
      record.data?.user.fullname || " ",
      record.data?.product.title || " ",
      req.body.reason
    );

    if (record.data?.user.email) {
      sendEmail({
        email: record.data?.user.email,
        subject: "Bạn đã bị chặn khỏi đấu giá",
        content: content,
      });
    }

    const response = gatewayResponse(
      HttpStatus.accepted,
      {
        record: record.data,
      },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const askSeller = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Need token before requesting'
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes('BIDDER')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để thực hiện yêu cầu này'
    );
    res.status(response.code).send(response);
    return;
  }
  const productId = req.params.productId || '';
  const question = req.body.question || '';
  if (productId === '' || question === '') {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Bạn cung cấp thiếu id cho sản phẩm hoặc thiếu nội dung câu hỏi'
    );
    res.status(response.code).send(response);
    return;
  }
  const data = {
    productId: productId,
    senderId: id,
    question: question,
  };
  const record = await service.askSeller(data);
  const productLink = `${process.env.FRONTEND_URL}/product/${productId}`;
  if (record.success) {
    const emailContent = loadAskTemplate(
      record.askerEmail,
      record.productName,
      record.question,
      productLink
    );
    const mailData = {
      data: {
        email: record.sellerEmail,
        subject: 'Người mua đặt câu hỏi',
        content: emailContent,
      },
    };
    const emailRecord = await sendEmail(mailData.data);
    if (emailRecord.success) {
      const response = gatewayResponse(
        HttpStatus.accepted,
        null,
        'Gửi câu hỏi thành công và đã gửi email đến người bán'
      );
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(
        HttpStatus.accepted,
        null,
        'Gửi câu hỏi thành công nhưng không thể gửi email đến người bán'
      );
      res.status(response.code).send(response);
    }
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const answerBidder = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Cần token trước khi yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes('BIDDER')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để thực hiện yêu cầu này'
    );
    res.status(response.code).send(response);
    return;
  }
  const commentId = req.params.commentId || '';
  const answer = req.body.answer || '';
  const productId = req.body.productId || '';
  if (commentId === '' || answer === '' || productId === '') {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      'Bạn cung cấp thiếu id cho câu hỏi hoặc thiếu nội dung câu trả lời hoặc thiếu id cho sản phẩm'
    );
    res.status(response.code).send(response);
    return;
  }
  const data = {
    commentId: commentId,
    answer: answer,
    productId: productId,
    sellerId: id,
  };
  const record = await service.answerBidder(data);
  const productLink = `${process.env.FRONTEND_URL}/product/${productId}`;
  if (record.success) {
    const emailContent = loadAnswerTemplate(
      record.bidderEmail,
      record.productName,
      record.answer,
      productLink
    );
    const mailData = {
      data: {
        email: record.bidderEmail,
        subject: 'Người bán trả lời câu hỏi',
        content: emailContent,
      },
    };
    const emailRecord = await sendEmail(mailData.data);
    if (emailRecord.success) {
      const response = gatewayResponse(
        HttpStatus.accepted,
        null,
        'Trả lời câu hỏi thành công và đã gửi email đến người hỏi'
      );
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(
        HttpStatus.accepted,
        null,
        'Trả lời câu hỏi thành công nhưng không thể gửi email đến người mua'
      );
      res.status(response.code).send(response);
    }
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const getAllCommentsByProductId = async (
  req: Request,
  res: Response
) => {
  const productId = req.params.productId;
  const page = Number(req.params.page) || 1;
  const limit = Number(req.params.limit) || 100;
  const data = {
    productId: productId,
    page: page,
    limit: limit,
  } as getALlCommentsDto;
  const record = await service.getAllCommentsByProductId(data);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      {
        comments: record.data,
      },
      'Lấy danh sách bình luận thành công'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.params.commentId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Nhập đầy đủ thông tin yêu cầu'
      );
      return res.status(response.code).send(response);
    }

    const data = {
      userId: req.user.id,
      commentId: req.params.commentId,
    } as deleteCommentDto;

    const record = await service.deleteComment(data);
    const response = gatewayResponse(HttpStatus.ok, record, `Xóa thành công`);
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log('From user controller: ', err.message);
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

export const getInforOfProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const data = await service.getInfoProfile(id);
    if (!data) {
      const response = gatewayResponse(400, null, 'Bad request');
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      200,
      data,
      'Get profile info successfully'
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(500, null, error.message);
    res.status(response.code).send(response);
  }
};

export const getBidderInfor = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Bad request');
      return res.status(response.code).send(response);
    }
    const id = req.user.id;
    const data = await service.getInfoProfile(id);
    if (!data) {
      const response = gatewayResponse(400, null, 'Bad request');
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      200,
      data,
      'Get profile info successfully'
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(500, null, error.message);
    res.status(response.code).send(response);
  }
};
