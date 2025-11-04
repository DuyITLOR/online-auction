import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import * as service from '../services/authService';

export const signIn = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const isExist = await service.checkExistEmail(userEmail);
  if (!isExist) {
    const response = gatewayResponse(
      401,
      null,
      'Email has not been registered'
    );
    res.status(response.code).send(response);
  }
  const resolve = await service.generateToken(userEmail, userPassword);
  if (resolve.success && resolve.token) {
    const response = gatewayResponse<string>(
      200,
      resolve.token,
      'Welcome back'
    );
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(401, null, resolve.message);
    res.status(response.code).send(response);
  }
};

export const signUp = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const isExist = await service.checkExistEmail(email);
  if (isExist) {
    const response = gatewayResponse(401, null, 'Email has been registered');
    res.status(response.code).send(response);
    return;
  }
  const flag = await service.addNewBidder(email, password, fullname);
  console.log('Sign up new account');
  if (flag.success && flag.token) {
    const response = gatewayResponse<string>(201, flag.token, 'Created');
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(500, null, flag.message);
    res.status(response.code).send(response);
  }
};
