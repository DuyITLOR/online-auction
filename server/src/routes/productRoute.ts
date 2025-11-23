import { authMiddleware } from '../middleware/authentication';
import { Request, Response } from 'express';
import { Router } from 'express';
import *  as productControllers from '../controllers/productControllers';
import { upload } from '../middleware/upload';
import { API_PRODUCT_ROUTES } from '../utils/permission';

const router = Router();
router.get(API_PRODUCT_ROUTES.getProduct.path, productControllers.getAllProducts);
router.get(API_PRODUCT_ROUTES.getProductById.path, productControllers.getProductById);

router.post(
    API_PRODUCT_ROUTES.createProduct.path, 
    authMiddleware, 
    upload.array('images', 10),
    productControllers.createProduct
);

router.patch(
    API_PRODUCT_ROUTES.updateProduct.path, 
    authMiddleware, 
    upload.array('images', 10),
    productControllers.updateProduct
);

router.delete(API_PRODUCT_ROUTES.deleteProduct.path, authMiddleware, productControllers.deleteProduct);


export default router;
