import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import * as controllers from '../controllers/settingControllers';

const router = Router();

router.get(API_ROUTES.getAllSettings.path, controllers.getAllSettings);

router.post(
  API_ROUTES.createSetting.path,
  authMiddleware,
  controllers.createSetting
);

router.put(
  API_ROUTES.updateSetting.path,
  authMiddleware,
  controllers.updateSetting
);

export default router;
