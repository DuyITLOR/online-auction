import { Router } from 'express';
import { getUserById, getUserIdByEmail } from '../controllers/userController';
import { API_ROUTES } from '../utils/apiRoutes';

const router = Router();

router.post('/getId', getUserIdByEmail);
router.get(API_ROUTES.userById, getUserById);

export default router;
