import { Request, response, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/userService';
import { uploadSingleFile } from '../utils/uploadImage';

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
    const response = gatewayResponse(400, null, 'Token Invalid');
    res.status(response.code).send(response);
    return;
  }
  const record = await uploadSingleFile(req, 'avatar');
  if (!record.success) console.log(record.fileUrl);
  res.status(200);
  // res.status(200).send(req.body.fullname);
};
