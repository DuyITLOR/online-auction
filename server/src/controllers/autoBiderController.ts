import { Request, Response } from 'express';
import * as autoBidService from '../services/autoBidService';
import { gatewayResponse } from '../utils/response';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';
import { bidHistoryQueryDto } from '../dto/autoBidDto';
import {
  loadBidSuccessTemplateForSeller,
  loadBidSuccessTemplateForBidder,
  loadBidFailedTemplate,
  sendEmail,
  loadOutbidTemplate,
} from '../utils/sendEmail';
import { autoBidResult } from '../dto/autoBidDto';
import { formatCurrency } from '../utils/format';

export const createAutoBid = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        'Token không hợp lệ'
      );
      return res.status(response.code).send(response);
    }

    const bidderId = req.user.id;
    let roles = await checkRole(bidderId);

    if (!roles.includes('BIDDER')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bị cấm: Người dùng không phải là người ra giá'
      );
      return res.status(response.code).send(response);
    }
    const { productId, maxAutoBidAmount } = req.body;

    if (!productId || !maxAutoBidAmount) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Thiếu các trường bắt buộc'
      );
      return res.status(response.code).send(response);
    }

    const data: autoBidResult = await autoBidService.createAutoBid({
      bidderId,
      productId,
      maxAutoBidAmount: Number(maxAutoBidAmount),
    });

    // console.log("Auto bid created:", data);

    // Gửi cho người thắng
    let content = "";

    if (data.winner.email !== "N/A") {
      let content = loadBidSuccessTemplateForBidder(
        data.winner.name,
        data.product.name,
        formatCurrency(data.product.price.toString()),
        `${process.env.FRONTEND_URL}/product/${data.product.id}`
      );

      sendEmail({
        email: data.winner.email,
        subject: "Thông báo ra giá thành công",
        content,
      });
    }

    // Gửi thông báo cho người bán
    if (data.seller.email !== "N/A") {
      content = loadBidSuccessTemplateForSeller(
        data.seller.name,
        data.product.name,
        formatCurrency(data.product.price.toString()),
        `${process.env.FRONTEND_URL}/product/${data.product.id}`
      );

      sendEmail({
        email: data.seller.email,
        subject: "Thông báo người đấu giá ra giá thành công sản phẩm của bạn",
        content,
      });
    }

    // Gửi thông báo cho người thua cuộc (nếu có)
    if (data.lastWinner.email !== "N/A") {
      if (data.lastWinner.type === "OVER") {
        content = loadBidFailedTemplate(
          data.lastWinner.name,
          data.product.name,
          "Thông báo bạn đã bị vượt qua trong cuộc đấu giá",
          `Sản phẩm của bạn đã có người ra giá cao hơn và giá hiện tại là ${formatCurrency(data.product.price.toString())}`,
          `${process.env.FRONTEND_URL}/product/${data.product.id}`
        );

        sendEmail({
          email: data.lastWinner.email,
          subject: "Bạn đã bị vượt qua trong cuộc đấu giá",
          content,
        });
      } else {
          content = loadBidFailedTemplate(
          data.lastWinner.name,
          data.product.name,
          "Thông báo bạn đã ra giá thất bại",
          `Sản phẩm của bạn đã có người ra giá cao hơn và giá hiện tại là ${formatCurrency(data.product.price.toString())} `,
          `${process.env.FRONTEND_URL}/product/${data.product.id}`

        );

        sendEmail({
          email: data.lastWinner.email,
          subject: "Thông báo ra giá thất bại",
          content,
        });
      }
    }

    const response = gatewayResponse(
      HttpStatus.created,
      data,
      'Tạo lệnh ra giá tự động thành công'
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getHistoryAutoBisByProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Thiếu tham số productId'
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.getBidHistory(productId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      'Lịch sử ra giá tự động được lấy thành công'
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getBidCountByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Thiếu tham số productId'
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.getBidCountByProductId(productId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      'Số lượng ra giá được lấy thành công'
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getMaxBidByUser = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    let roles = await checkRole(userId!);

    if (!roles.includes('BIDDER')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bị cấm: Người dùng không phải là người ra giá'
      );
      return res.status(response.code).send(response);
    }

    if (!productId || !userId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Thiếu tham số productId hoặc userId'
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.getMaxBidByUserId(productId, userId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      'Lấy ra giá tối đa thành công'
    );

    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getBidHistoryByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    let roles = await checkRole(userId!);
    if (!roles.includes('BIDDER')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Forbidden: User is not a bidder'
      );

      return res.status(response.code).send(response);
    }

    const queryParams = req.query as bidHistoryQueryDto;
    const data = await autoBidService.getBidHistoryByUserId(
      userId!,
      queryParams
    );

    if (!data) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        'No bid history found'
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      'Bid history retrieved successfully'
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};
