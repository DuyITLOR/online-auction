import { authMiddleware } from '../middleware/authentication';
import { Request, Response } from 'express';
import { Router } from 'express';
import *  as productControllers from '../controllers/productControllers';


const router = Router();
router.get('/', authMiddleware, productControllers.getAllProducts);
router.get('/:id', authMiddleware, productControllers.getProductById);
router.post('/', authMiddleware, productControllers.createProduct);
router.patch('/:id', authMiddleware, productControllers.updateProduct);
router.delete('/:id', authMiddleware, productControllers.deleteProduct);


export default router;
