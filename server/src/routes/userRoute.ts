import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import { upload } from '../middleware/upload';
import * as controllers from '../controllers/userControllers';

const router = Router();

router.get(
  API_ROUTES.getUserById.path,
  authMiddleware,
  controllers.getUserById
);
router.get(
  API_ROUTES.getAllBlockedUser.path,
  authMiddleware,
  controllers.getAllBlockedUser
);
router.post(
  API_ROUTES.requestUpgrade.path,
  authMiddleware,
  controllers.requestUpgrade
);
router.post(
  API_ROUTES.blockBidder.path,
  authMiddleware,
  controllers.blockBidder
);
router.patch(
  API_ROUTES.updateUser.path,
  authMiddleware,
  upload.single('avatar'),
  controllers.updateUser
);

export default router;
