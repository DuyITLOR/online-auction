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
router.get(API_ROUTES.getUserInformation.path, controllers.getUser);
router.get(
  API_ROUTES.getAllBlockedUser.path,
  authMiddleware,
  controllers.getAllBlockedUser
);
router.get(
  API_ROUTES.getAllCommentsByProductId.path,
  controllers.getAllCommentsByProductId
);
router.get(
  API_ROUTES.profileSummary.path,
  authMiddleware,
  controllers.getInforOfProfile
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
router.post(API_ROUTES.askSeller.path, authMiddleware, controllers.askSeller);
router.post(
  API_ROUTES.answerBidder.path,
  authMiddleware,
  controllers.answerBidder
);

router.patch(
  API_ROUTES.updateUser.path,
  authMiddleware,
  upload.single('avatar'),
  controllers.updateUser
);

export default router;
