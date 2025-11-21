import { Request, Response } from 'express';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authentication';
import { upload } from '../middleware/upload';
import multer from 'multer';

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

export default router;
