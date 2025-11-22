import { Router } from 'express';
import { API_ROUTES } from '../utils/permission';
import * as controllers from '../controllers/authControllers';
import passport from 'passport';

const router = Router();

router.post(API_ROUTES.signIn.path, controllers.signIn);
router.post(API_ROUTES.signUp.path, controllers.signUp);
router.post(API_ROUTES.verifyEmail.path, controllers.verifyEmail);
router.get(
  API_ROUTES.signInViaGoogle.path,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  API_ROUTES.googleCallback.path,
  passport.authenticate('google', { session: false }),
  controllers.googleCallback
);

router.get(API_ROUTES.verifyToken.path, controllers.verifyToken);

export default router;
