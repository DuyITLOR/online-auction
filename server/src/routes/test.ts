import { request, Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authentication';
import { upload } from '../middleware/upload';
import multer from 'multer';
import { prisma } from '../services/db/prisma';
import * as authService from '../services/authService';
import { gatewayResponse } from '../utils/response';
import {
  sendEmail,
  loadCodeTemplate,
  loadResetTemplate,
  loadBidFailedTemplate,
  loadNoBuyerTemplate,
  loadOrderTemplate,
  loadAskTemplate,
  loadAnswerTemplate,
} from '../utils/sendEmail';

const router = Router();

// Test upload file
router.post('/test', upload.single('file'), (req: Request, res: Response) => {
  if (req.file) {
    console.log(req.file);
    res.send('oke');
  } else {
    console.log('not oke');
    res.send('not oke');
  }
});

// Test using template to send email
router.post('/test-send-mail/code', async (req: Request, res: Response) => {
  const dumpCode = '123456';
  const email = req.body.email;
  const content = loadCodeTemplate(dumpCode);
  const data = {
    email: email,
    subject: 'Mã xác thực',
    content: content,
  };

  const record = await sendEmail(data);
  res.status(200).send(null);
});
router.post('/test-send-mail/reset', async (req: Request, res: Response) => {
  const resetLink = 'http://example.com/reset?token=abcdefg';
  const email = req.body.email;
  const content = loadResetTemplate(resetLink);
  const data = {
    email: email,
    subject: 'Đặt lại mật khẩu',
    content: content,
  };

  const record = await sendEmail(data);
  res.status(200).send(null);
});


router.post(
  '/test-send-mail/bid/failed',
  async (req: Request, res: Response) => {
    const userName = req.body.userName;
    const productName = req.body.productName;
    const reason = req.body.reason;
    const email = req.body.email;
    const content = loadBidFailedTemplate(userName, productName, reason);
    const data = {
      email: email,
      subject: 'Đấu giá thất bại',
      content: content,
    };
    const record = await sendEmail(data);
    res.status(200).send(null);
  }
);
router.post(
  '/test-send-mail/bid/orders/no',
  async (req: Request, res: Response) => {
    const userName = req.body.userName;
    const productName = req.body.productName;
    const email = req.body.email;
    const content = loadNoBuyerTemplate(userName, productName);
    const data = {
      email: email,
      subject: 'Đấu giá kết thúc - Không có người mua',
      content: content,
    };
    const record = await sendEmail(data);
    res.status(200).send(null);
  }
);
router.post(
  '/test-send-mail/bid/orders',
  async (req: Request, res: Response) => {
    const productName = req.body.productName;
    const winningPrice = req.body.winningPrice;
    const sellerEmail = req.body.sellerEmail;
    const winnerEmail = req.body.winnerEmail;
    const content = loadOrderTemplate(
      productName,
      winningPrice,
      sellerEmail,
      winnerEmail
    );
    const data = {
      email: 'truongthanhdat6879@gmail.com',
      subject: 'Thông tin người thắng đấu giá',
      content: content,
    };
    const record = await sendEmail(data);
    res.status(200).send(null);
  }
);
router.post(
  '/test-send-mail/products/ask',
  async (req: Request, res: Response) => {
    const askerEmail = req.body.askerEmail;
    const productName = req.body.productName;
    const question = req.body.question;
    const content = loadAskTemplate(askerEmail, productName, question);
    const data = {
      email: 'truongthanhdat6879@gmail.com',
      subject: 'Người mua đặt câu hỏi',
      content: content,
    };
    const record = await sendEmail(data);
    res.status(200).send(null);
  }
);
router.post(
  '/test-send-mail/products/answer',
  async (req: Request, res: Response) => {
    const sellerEmail = req.body.sellerEmail;
    const productName = req.body.productName;
    const answer = req.body.answer;
    const content = loadAnswerTemplate(sellerEmail, productName, answer);
    const data = {
      email: 'truongthanhdat6879@gmail.com',
      subject: 'Người bán trả lời câu hỏi',
      content: content,
    };
    const record = await sendEmail(data);
    res.status(200).send(null);
  }
);

// Test generate free token
router.get('/get-free-token/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const token = await authService.generateToken(id, user.email);
    const response = gatewayResponse(
      200,
      { token, email: user.email },
      'Send token successfully'
    );
    res.status(200).send(response);
  } else {
    const response = gatewayResponse(400, null, 'Unvalid id');
    res.status(response.code).send(response);
  }
});

// Test auth middleware
router.get(
  '/decode-token',
  authMiddleware,
  async (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).send(req.user);
    } else {
      res.status(400).send('Bad request');
    }
  }
);

export default router;
