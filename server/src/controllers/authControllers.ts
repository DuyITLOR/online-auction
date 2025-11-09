import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import { sendEmail } from '../utils/sendEmail';
import * as service from '../services/authService';

export const signIn = async (req: Request, res: Response) => {
  // const userEmail = req.body.email;
  // const userPassword = req.body.password;
  // const isExist = await service.checkExistEmail(userEmail);
  // if (!isExist) {
  //   const response = gatewayResponse(
  //     401,
  //     null,
  //     'Email has not been registered'
  //   );
  //   res.status(response.code).send(response);
  // }
  // const resolve = await service.generateToken(userEmail, userPassword);
  // if (resolve.success && resolve.token) {
  //   const response = gatewayResponse<string>(
  //     200,
  //     resolve.token,
  //     'Welcome back'
  //   );
  //   res.status(response.code).send(response);
  // } else {
  //   const response = gatewayResponse(401, null, resolve.message);
  //   res.status(response.code).send(response);
  // }
};

export const signUp = async (req: Request, res: Response) => {
  const email = req.body.email;
  const isExist = await service.checkExistEmail(email);
  if (isExist) {
    const response = gatewayResponse(401, null, 'Email has been registered');
    res.status(response.code).send(response);
    return;
  }
  const code = service.generateCode();
  const record = await sendEmail({
    email,
    content: code,
  });
  if (record.success) {
    const _ = await service.addEmailVerification(code, email);
    const response = gatewayResponse(200, null, record.message);
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(400, null, record.message);
    res.status(response.code).send(response);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const code = req.body.code;
  console.log('hello from verify');
};
