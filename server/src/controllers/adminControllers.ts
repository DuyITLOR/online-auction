import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/adminService';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';
import { getAllUsersServiceDto } from '../dto/adminDto';
import { hashPassword } from '../services/authService';
import {
  loadPasswordResetSuccessTemplate,
  sendEmail,
} from '../utils/sendEmail';

export const getAllUsers = async (req: Request, res: Response) => {
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
  const roles = await checkRole(id);
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }

  const limit = req.query.limit || 0;
  const page = req.query.page || 0;
  const data = {
    limit: Number(limit),
    page: Number(page),
  } as getAllUsersServiceDto;

  // Call service
  const record = await service.getAllUsers(data);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.accepted,
      { data: record.users },
      'Lấy danh sách người dùng thành công'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.serviceUnavailable,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const getAllRequest = async (req: Request, res: Response) => {
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
  const roles = await checkRole(id);
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  const limit = req.query.limit || 0;
  const page = Number(req.query.page) - 1 || 0;
  const data = {
    limit: Number(limit),
    page: Number(page),
  };
  const record = await service.getAllRequest(data);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      { data: record.requests },
      'Lấy thành công'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.serviceUnavailable,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const getAllDeactivatedUsers = async (req: Request, res: Response) => {
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
  const roles = await checkRole(id);
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  try {
    const users = await service.getAllDeactivatedUsers();
    const response = gatewayResponse(
      HttpStatus.ok,
      { users },
      'Lấy danh sách người dùng bị vô hiệu hóa thành công'
    );
    res.status(response.code).send(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    const response = gatewayResponse(HttpStatus.serviceUnavailable, null, msg);
    res.status(response.code).send(response);
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  // console.log("acceptRequest called with params:", req.params);
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
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  const requestId = req.params.requestId;
  const record = await service.acceptRequest(requestId);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.accepted,
      { record: record.data },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const refuseRequest = async (req: Request, res: Response) => {
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
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  const requestId = req.params.requestId;
  const record = await service.refuseRequest(requestId);
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      { record: record.data },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.serviceUnavailable,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
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

    const roles = await checkRole(req.user.id);
    if (!roles.includes('ADMIN')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bạn không có quyền để yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }

    const userId = req.params.userId;
    const record = await service.deactivateUser(userId);
    const response = gatewayResponse(
      HttpStatus.ok,
      null,
      `Người dùng ${record.fullname} đã bị vô hiệu hóa thành công`
    );
    res.status(response.code).send(response);
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    const response = gatewayResponse(HttpStatus.serviceUnavailable, null, msg);
    res.status(response.code).send(response);
    return;
  }
};

export const activateUser = async (req: Request, res: Response) => {
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

    const roles = await checkRole(req.user.id);
    if (!roles.includes('ADMIN')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bạn không có quyền để yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }

    const userId = req.params.userId;
    const record = await service.activateUser(userId);
    const response = gatewayResponse(
      HttpStatus.ok,
      null,
      `Người dùng ${record.fullname} đã được kích hoạt thành công`
    );
    res.status(response.code).send(response);
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    const response = gatewayResponse(HttpStatus.serviceUnavailable, null, msg);
    res.status(response.code).send(response);
    return;
  }
};

export const resetPasswordByAdmin = async (req: Request, res: Response) => {
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

    const roles = await checkRole(req.user.id);
    if (!roles.includes('ADMIN')) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Bạn không có quyền để yêu cầu'
      );
      res.status(response.code).send(response);
      return;
    }

    const userId = req.params.userId;
    const newPassword = req.body.newPassword;
    const hashedPassword = await hashPassword(newPassword);
    const record = await service.resetUserPassword(userId, hashedPassword);

    if (!newPassword) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Mật khẩu mới không được để trống'
      );
      res.status(response.code).send(response);
      return;
    }

    if (!record) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        'Người dùng không tồn tại'
      );
      res.status(response.code).send(response);
      return;
    }

    // Send email notification to user about password reset
    const content = loadPasswordResetSuccessTemplate(
      record.fullname || '',
      record.email,
      newPassword
    );

    sendEmail({
      email: record.email,
      subject: 'Đặt lại mật khẩu thành công',
      content: content,
    });

    const response = gatewayResponse(
      HttpStatus.ok,
      null,
      `Mật khẩu của người dùng ${record.fullname} đã được đặt lại thành công`
    );
    res.status(response.code).send(response);
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    const response = gatewayResponse(HttpStatus.serviceUnavailable, null, msg);
    res.status(response.code).send(response);
    return;
  }
};

export const getAdminDashboardData = async (req: Request, res: Response) => {
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
  const roles = await checkRole(id);
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'Bạn không có quyền để yêu cầu'
    );
    res.status(response.code).send(response);
    return;
  }
  const record = await service.getAdminDashboardData();
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      { data: record.data },
      record.message
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(
      HttpStatus.serviceUnavailable,
      null,
      record.message
    );
    res.status(response.code).send(response);
  }
};
