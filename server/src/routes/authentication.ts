import { Router } from 'express';
import { API_ROUTES } from '../utils/apiRoutes';
import { authMiddleware } from '../middleware/authentication';
import * as controllers from '../controllers/authControllers';

const router = Router();

router.post(API_ROUTES.signIn, controllers.signIn);
router.post(API_ROUTES.signUp, controllers.signUp);
router.post(API_ROUTES.verifyEmail, controllers.verifyEmail);
router.post(API_ROUTES.updateUser, controllers.updateUser);

export default router;
