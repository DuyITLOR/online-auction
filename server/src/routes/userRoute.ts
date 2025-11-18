import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import { upload } from '../middleware/upload';
import * as controllers from '../controllers/userController';

const router = Router();

router.get(
  API_ROUTES.getUserById.path,
  authMiddleware,
  controllers.getUserById
);
router.post(
  API_ROUTES.updateUser.path,
  authMiddleware,
  upload.array('images', 10),
  controllers.updateUser
);

export default router;
