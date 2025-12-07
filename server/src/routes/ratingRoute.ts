import { Router } from 'express';
import { API_RATING_ROUTES, API_ROUTES } from '../utils/permission';
import { authMiddleware } from '../middleware/authentication';
import * as controllers from '../controllers/ratingControllers';

const router = Router();

router.get(
  API_RATING_ROUTES.getAllRatings.path,
  authMiddleware,
  controllers.getAllRatings
);
router.post(
  API_RATING_ROUTES.rateUser.path,
  authMiddleware,
  controllers.rateUser
);
router.patch(
  API_RATING_ROUTES.updateRating.path,
  authMiddleware,
  controllers.udpateRaing
);
router.delete(
  API_RATING_ROUTES.deleteRating.path,
  authMiddleware,
  controllers.deleteRating
);

export default router;
