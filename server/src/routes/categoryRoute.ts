import { authMiddleware } from "../middleware/authentication";
import { Request, Response } from "express";
import { Router } from "express";
import * as categoryControllers from "../controllers/categoryControllers";
import { API_CATEGORY_ROUTES } from "../utils/permission";

const router = Router();

router.post(
  API_CATEGORY_ROUTES.createCategory.path,
  authMiddleware,
  categoryControllers.createCategory
);
router.patch(
  API_CATEGORY_ROUTES.updateCategory.path,
  authMiddleware,
  categoryControllers.updateCategory
);
router.delete(
  API_CATEGORY_ROUTES.deleteCategory.path,
  authMiddleware,
  categoryControllers.deleteCategory
);

router.get(
  API_CATEGORY_ROUTES.getAllCategories.path,
  categoryControllers.getAllCategories
);
router.get(
  API_CATEGORY_ROUTES.getCategoryById.path,
  categoryControllers.getCategoryById
);

router.get(
  API_CATEGORY_ROUTES.getAllChildProducts.path,
  categoryControllers.getAllChildProducts
);

export default router;
