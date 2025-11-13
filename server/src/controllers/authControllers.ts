import { Request, Response } from 'express';
import { gatewayResponse } from '../utils/response';
import { sendEmail } from '../utils/sendEmail';
import * as service from '../services/authService';

interface Bidder {
  id: string;
  email: string;
  fullname?: string;
  // ...other fields
}

interface AddBidderResult {
  success: boolean;
  bidder?: Bidder | null;
  message?: string;
}

export const signIn = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const bidder = await service.getBidder(email);
  if (!bidder) {
    const response = gatewayResponse(
      400,
      null,
      'Email has not been registered'
    );
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
      const response = gatewayResponse(
        400,
        null,
        'Email or password is invalid'
      );
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

export const googleAuthentication = async (req: Request, res: Response) => {
  try {
    const email = req.body.email as string;
    const fullname = req.body.fullname as string;

    // đảm bảo service.getBidder trả về Promise<Bidder | null>
    const bidder = (await service.getBidder(email)) as Bidder | null;

    if (!bidder) {
      // người dùng chưa tồn tại -> tạo mới
      const code = service.generateCode(); // Gen temporary password
      const hashed = await service.hashPassword(code);

      // đảm bảo service.addNewBidder trả về AddBidderResult
      const newBidder = (await service.addNewBidder(
        email,
        fullname,
        hashed
      )) as AddBidderResult;

      if (newBidder.success && newBidder.bidder) {
        // chắc chắn newBidder.bidder tồn tại
        const token = await service.generateToken(newBidder.bidder.id, email);
        const response = gatewayResponse(
          200,
          { token, fullname, email },
          'User sign up'
        );
        res.status(response.code).send(response);
        return;
      }

      // Nếu không thành công tạo user — trả lỗi
      const response = gatewayResponse(
        500,
        null,
        newBidder.message ?? 'Failed to create user'
      );
      res.status(response.code).send(response);
      return;
    }

    // Nếu bidder đã tồn tại
    // (đến đây bidder có kiểu Bidder)
    const token = await service.generateToken(bidder.id, bidder.email);
    const response = gatewayResponse(
      200,
      { token, fullname: bidder.fullname ?? fullname, email: bidder.email },
      'Login successful'
    );
    res.status(response.code).send(response);
  } catch (err) {
    console.error('googleAuthentication error:', err);
    const response = gatewayResponse(500, null, 'Internal server error');
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
