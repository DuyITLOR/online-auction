import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import * as controllers from '../controllers/authControllers';

const router = Router();

router.post(API_ROUTES.signIn.path, controllers.signIn);
router.post(API_ROUTES.signUp.path, controllers.signUp);
router.post(API_ROUTES.verifyEmail.path, controllers.verifyEmail);
router.post(API_ROUTES.signInViaGoogle.path, controllers.googleAuthentication);

export default router;
