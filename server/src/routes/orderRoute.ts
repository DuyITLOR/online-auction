import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import * as orderController from "../controllers/orderControlller";
import { API_ORDER_ROUTES } from "../utils/permission";

const router = Router();

router.get(
    API_ORDER_ROUTES.getOrders.path,
    authMiddleware,
    orderController.getOrderById
)

export default router;