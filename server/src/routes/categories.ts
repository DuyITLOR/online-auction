import { Router } from 'express';
import { API_ROUTES } from '../utils/apiRoutes';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  findParentCategories,
  findChildCategories,
  findProductsByCategory,
} from '../controllers/categoryController';

const router = Router();

router.get(API_ROUTES.getAllCategories, getAllCategories);
router.get(API_ROUTES.getCategoryById, getCategoryById);
router.post(API_ROUTES.createCategory, createCategory);
router.put(API_ROUTES.updateCategory, updateCategory);
router.delete(API_ROUTES.deleteCategory, deleteCategory);

router.get(API_ROUTES.findParentCategories, findParentCategories);
router.get(API_ROUTES.findChildCategories, findChildCategories);
router.get(API_ROUTES.findProductsByCategory, findProductsByCategory);

export default router;
