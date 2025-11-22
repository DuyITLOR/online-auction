import { Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authentication';
import { upload } from '../middleware/upload';
import multer from 'multer';
import { prisma } from '../services/db/prisma';
import * as authService from '../services/authService';
import { gatewayResponse } from '../utils/response';

const router = Router();

router.post('/test', upload.single('file'), (req: Request, res: Response) => {
  if (req.file) {
    console.log(req.file);
    res.send('oke');
  } else {
    console.log('not oke');
    res.send('not oke');
  }
});

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
