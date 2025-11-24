import { Router } from "express";
import { API_WATCHLIST_ROUTES } from "../utils/permission";
import { authMiddleware } from "../middleware/authentication";
import * as watchListControllers from "../controllers/watchListControllers";

const router = Router();

router.post(API_WATCHLIST_ROUTES.addWatchList.path, authMiddleware, watchListControllers.addWatchList);
router.delete(API_WATCHLIST_ROUTES.removeWatchList.path, authMiddleware, watchListControllers.removeWatchList);
router.get(API_WATCHLIST_ROUTES.getWatchList.path, authMiddleware, watchListControllers.getWatchList);

export default router;