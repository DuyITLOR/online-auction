import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/userService';
import { uploadSingleFile } from '../utils/uploadImage';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';

export const getUserById = async (req: Request, res: Response) => {
  if (!req.user) {
    const response = gatewayResponse(400, null, 'Token Invalid');
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  const record = await service.getUserById(id);
  if (record.success) {
    const response = gatewayResponse(
      200,
      {
        user: record.user,
      },
      'Get user'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(400, null, 'Bad request');
    res.status(response.code).send(response);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid',
    });
  }

  const avt = await uploadSingleFile(req, 'avatar');
  const avtUrl = avt.fileUrl;
  const fullname = req.body.fullname;
  const record = await service.updateUser(req.user.id, {
    fullname,
    avtUrl,
  });
  if (record.success) {
    const response = gatewayResponse(
      200,
      // {
      //   data: record.data ?? null,
      // },
      null,
      'update user'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(400, null, 'Bad request');
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

export const acceptRequest = async (req: Request, res: Response) => {
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
  if (!roles.includes('ADMIN')) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      'You do not have permission for requesting'
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
      'Need token before requesting'
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
      'You do not have permission for requesting'
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
