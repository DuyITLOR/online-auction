import { Router } from "express";
import { authMiddleware } from "../middleware/authentication";
import * as orderController from "../controllers/orderControlller";
import { API_ORDER_ROUTES } from "../utils/permission";
import { upload } from "../middleware/upload";

const router = Router();

router.get(
    API_ORDER_ROUTES.getOrders.path,
    authMiddleware,
    orderController.getOrder
)

router.get(
    API_ORDER_ROUTES.getOrderById.path,
    authMiddleware,
    orderController.getOrderById
)

router.patch(
    API_ORDER_ROUTES.uploadBankInfo.path,
    authMiddleware,
    upload.single("image"),
    orderController.uploadBankInfo
)

router.patch(
    API_ORDER_ROUTES.uploadPayment.path,
    authMiddleware,
    upload.single("image"),
    orderController.uploadPaymentInfo
)

router.patch(
    API_ORDER_ROUTES.uploadShippingInfo.path,
    authMiddleware,
    upload.single("image"),
    orderController.uploadShippingInfo
)
export default router;