import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/adminService';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';

export const getAllRequest = async (req: Request, res: Response) => {
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
  const record = await service.getAllRequest();
  if (record.success) {
    const response = gatewayResponse(
      HttpStatus.ok,
      { requests: record.requests },
      'Get successfully'
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
