import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import * as controllers from '../controllers/adminControllers';

const router = Router();

router.get(
  API_ROUTES.getAllUsers.path,
  authMiddleware,
  controllers.getAllUsers
)
router.get(
  API_ROUTES.getAllRequest.path,
  authMiddleware,
  controllers.getAllRequest
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
