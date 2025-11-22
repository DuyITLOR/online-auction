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
router.post(
  API_ROUTES.requestUpgrade.path,
  authMiddleware,
  controllers.requestUpgrade
);
router.patch(
  API_ROUTES.updateUser.path,
  authMiddleware,
  upload.single('avatar'),
  controllers.updateUser
);
router.patch(
  API_ROUTES.acceptRequest.path,
  authMiddleware,
  controllers.acceptRequest
);
router.patch(
  API_ROUTES.refuseRequest.path,
  authMiddleware,
  controllers.refuseRequest
);

export default router;
