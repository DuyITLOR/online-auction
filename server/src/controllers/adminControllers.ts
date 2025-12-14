import { Request, Response } from "express";
import { gatewayResponse } from "../utils/response";
import * as service from "../services/adminService";
import { HttpStatus } from "../utils/permission";
import { checkRole } from "../utils/checkRole";
import { getAllUsersServiceDto } from "../dto/adminDto";

export const getAllUsers = async (req: Request, res: Response) => {
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
  const roles = await checkRole(id);
  if (!roles.includes("ADMIN")) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      "You do not have permission for requesting"
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
      "Lấy danh sách người dùng thành công"
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
      "Need token before requesting"
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  const roles = await checkRole(id);
  if (!roles.includes("ADMIN")) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      "You do not have permission for requesting"
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
      "Get successfully"
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
  // console.log("acceptRequest called with params:", req.params);
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
  if (!roles.includes("ADMIN")) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      "You do not have permission for requesting"
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
      "Need token before requesting"
    );
    res.status(response.code).send(response);
    return;
  }
  const id = req.user.id;
  // Check role
  const roles = await checkRole(id);
  if (!roles.includes("ADMIN")) {
    const response = gatewayResponse(
      HttpStatus.forbidden,
      null,
      "You do not have permission for requesting"
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
