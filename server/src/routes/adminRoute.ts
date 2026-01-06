import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import * as controllers from '../controllers/adminControllers';

const router = Router();

router.get(
  API_ROUTES.getAllUsers.path,
  authMiddleware,
  controllers.getAllUsers
);
router.get(
  API_ROUTES.getAllRequest.path,
  authMiddleware,
  controllers.getAllRequest
);
router.get(
  API_ROUTES.getAdminDashboardData.path,
  authMiddleware,
  controllers.getAdminDashboardData
);
router.get(
  API_ROUTES.getAllDeactivatedUsers.path,
  authMiddleware,
  controllers.getAllDeactivatedUsers
);

router.patch(
  API_ROUTES.deactivateUser.path,
  authMiddleware,
  controllers.deactivateUser
);
router.patch(
  API_ROUTES.activateUser.path,
  authMiddleware,
  controllers.activateUser
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
router.patch(
  API_ROUTES.resetPasswordByAdmin.path,
  authMiddleware,
  controllers.resetPasswordByAdmin
);

export default router;
