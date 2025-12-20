import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/ratingService';
import { HttpStatus } from '../utils/permission';
import {
  deleteRatingDto,
  getRatingDto,
  ratingInputDto,
} from '../dto/ratingDto';
import { checkRole } from '../utils/checkRole';

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Nhập đầy đủ thông tin yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }
    const userId = req.user.id;
    const type = req.query.type || 'all';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    // Check role
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
      userId: userId,
      type: type,
      page: page,
      limit: limit,
    } as getRatingDto;
    const ratings = await service.getAllRatings(data);
    const response = gatewayResponse(
      HttpStatus.created,
      ratings,
      `Lấy thông tin đánh giá`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log('From rating controller: ', err.message);
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

export const rateUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as ratingInputDto;
    const rateeId = req.params.rateeId;
    if (
      body.comment === undefined ||
      body.productId === undefined ||
      body.value === undefined ||
      rateeId === undefined ||
      !req.user
    ) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Nhập đầy đủ thông tin yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }
    const data = {
      rateeId: rateeId,
      raterId: req.user.id,
      productId: body.productId,
      value: Number(body.value),
      comment: body.comment,
    };
    const record = await service.createRating(data);
    const response = gatewayResponse(
      HttpStatus.created,
      record,
      `Đánh giá thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log('From rating controller: ', err.message);
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

export const udpateRaing = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const ratingId = req.params.ratingId;
    const data = {
      id: ratingId,
      value: body.value,
      comment: body.comment,
    };
    const record = await service.updateRating(data);
    const response = gatewayResponse(
      HttpStatus.created,
      record,
      `Chỉnh sửa thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log('From rating controller: ', err.message);
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

export const deleteRating = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.params.ratingId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Nhập đầy đủ thông tin yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }
    const data = {
      ratingId: req.params.ratingId,
      userId: req.user.id,
    } as deleteRatingDto;
    const record = await service.deleteRating(data);
    const response = gatewayResponse(
      HttpStatus.created,
      record,
      `Xóa thành công`
    );
    res.status(response.code).send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log('From rating controller: ', err.message);
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
