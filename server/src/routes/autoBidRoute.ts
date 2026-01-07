import { authMiddleware } from "../middleware/authentication";
import { Router } from "express";
import * as autoBidController from "../controllers/autoBiderController";
import { API_AUTO_BID_ROUTES } from "../utils/permission";

const router = Router();

router.post(
  API_AUTO_BID_ROUTES.createAutoBid.path,
  authMiddleware,
  autoBidController.createAutoBid
);

router.get(
  API_AUTO_BID_ROUTES.getHistoryAutoBidByProduct.path,
  authMiddleware,
  autoBidController.getHistoryAutoBisByProduct
);

router.get(
  API_AUTO_BID_ROUTES.getBidCountByProductId.path,
  autoBidController.getBidCountByProduct
);

router.get(
  API_AUTO_BID_ROUTES.getMaxBidByUser.path,
  authMiddleware,
  autoBidController.getMaxBidByUser
)

router.get(
  API_AUTO_BID_ROUTES.getBidHistoryByUserId.path,
  authMiddleware,
  autoBidController.getBidHistoryByUserId
)

router.get(
  API_AUTO_BID_ROUTES.getAutoBidByUserId.path,
  authMiddleware,
  autoBidController.getAutoBidsByUserId
)

export default router;