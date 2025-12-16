import { authMiddleware } from '../middleware/authentication';
import { Router } from 'express';
import { API_CHAT_ROUTES } from '../utils/permission';
import * as controllers from '../controllers/chatControllers';

const router = Router();

router.get(
  API_CHAT_ROUTES.getMessagesByProduct.path,
  authMiddleware,
  controllers.getAllMessage
);

router.post(
  API_CHAT_ROUTES.sendMessage.path,
  authMiddleware,
  controllers.sendMessage
);

export default router;
