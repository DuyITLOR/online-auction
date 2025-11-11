import { Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authentication';

const router = Router();

router.get('/test', authMiddleware, (req: Request, res: Response) => {
  console.log(req.user);
});

export default router;
