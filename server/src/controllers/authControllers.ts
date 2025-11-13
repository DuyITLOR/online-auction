import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import { sendEmail } from '../utils/sendEmail';
import * as service from '../services/authService';
import axios from 'axios';

export const signIn = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const recaptchaToken = req.body.recaptchaToken;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '';

  const params = new URLSearchParams();
  params.append('secret', secretKey);
  params.append('response', recaptchaToken);

  const ggRes = await axios.post('https://www.google.com/recaptcha/api/siteverify', params);
  const ggData = ggRes.data;

  if (!ggData.success) {
    return res.status(400).json({
      message: 'Xác minh reCAPTCHA thất bại. Vui lòng thử lại.',
      errors: ggData['error-codes'],
    });
  }

  const bidder = await service.getBidder(email);
  if (!bidder) {
    const response = gatewayResponse(400, null, 'Email has not been registered');
    res.status(response.code).send(response);
    return;
  }
  if (bidder.password == null) {
    const response = gatewayResponse(200, null, 'update user first');
    res.status(response.code).send(response);
  } else {
    const isMatched = await service.comparePassword(password, bidder.password);
    if (isMatched) {
      const token = await service.generateToken(bidder.id, bidder.email);
      const user = await service.getBidder(email);
      const response = gatewayResponse(200, { token, user }, 'Welcome back');
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(400, null, 'Email or password is invalid');
      res.status(response.code).send(response);
      return;
    }
  }
};

export const signUp = async (req: Request, res: Response) => {
  const email = req.body.email;
  // Check email has been registered before
  const isExist = await service.checkExistEmail(email);
  if (isExist) {
    const response = gatewayResponse(401, null, 'Email has been registered');
    res.status(response.code).send(response);
    return;
  }
  // Generate code for verify
  const code = service.generateCode();
  // Send code to register
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
  const email = req.body.email;
  const password = req.body.password;
  const hashed = await service.hashPassword(password);
  const fullname = req.body.fullname;
  const record = await service.verifyCode(code, email);
  if (record.success) {
    const bidder = await service.addNewBidder(email, fullname, hashed);
    const token = await service.generateToken(bidder.message, email); // message here = id of bidder
    if (bidder.success) {
      const response = gatewayResponse(200, { token }, bidder.message);
      res.status(response.code).send(response);
    } else {
      const response = gatewayResponse(400, null, bidder.message);
      res.status(response.code).send(response);
    }
  } else {
    const response = gatewayResponse(400, null, record.message);
    res.status(response.code).send(response);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const password = req.body.password;
  const hashed = await service.hashPassword(password);
  const record = await service.updateUser(email, fullname, hashed);
  if (record) {
    const response = gatewayResponse(200, null, 'Updated');
    res.status(response.code).send(response);
  } else {
    const response = gatewayResponse(200, null, 'Update Failed');
    res.status(response.code).send(response);
  }
};
