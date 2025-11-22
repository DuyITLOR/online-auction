import { authMiddleware } from '../middleware/authentication';
import { Request, Response } from 'express';
import { Router } from 'express';
import *  as productControllers from '../controllers/productControllers';
import { upload } from '../middleware/upload';


const router = Router();
router.get('/product', productControllers.getAllProducts);
router.get('/product/:id', productControllers.getProductById);

router.post(
    '/product', 
    authMiddleware, 
    upload.array('images', 10),
    productControllers.createProduct
);

router.patch(
    '/product/:id', 
    authMiddleware, 
    upload.array('images', 10),
    productControllers.updateProduct
);

router.delete('/product/:id', authMiddleware, productControllers.deleteProduct);


export default router;
