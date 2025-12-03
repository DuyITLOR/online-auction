import { Request, Response } from "express";
import * as Service from "../services/cateService";
import {
  createCategoryDto,
  updateCategoryDto,
  categoryQueryDto,
} from "../dto/categoryDto";
import { checkRole } from "../utils/checkRole";
import { success } from "zod";

export async function createCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes("ADMIN")) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden. Admins only." });
    }

    const body: createCategoryDto = req.body;
    const category = await Service.createCate(body);
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: (error as Error).message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes("ADMIN")) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden. Admins only." });
    }

    const categoryId = req.params.id;
    const body: updateCategoryDto = req.body;
    const updated = await Service.updateCate(categoryId, body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes("ADMIN")) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden. Admins only." });
    }

    const categoryId = req.params.id;
    console.log("Deleting category with ID:", categoryId);
    const deleted = await Service.deleteCate(categoryId);
    // Return 204 no content on success
    return res
      .status(204)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes("not found")) {
      return res.status(404).json({ success: false, error: msg });
    }
    if (msg.includes("has products")) {
      return res.status(409).json({ success: false, error: msg });
    }
    return res.status(500).json({ success: false, error: msg });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  const categoryID = req.params.id;
  try {
    const category = await Service.findCateById(categoryID);
    if (!category)
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: (error as Error).message });
  }
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const parents = req.query.parents as string | undefined;

    const categories = await Service.SearchCategories(parents);
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: (error as Error).message });
  }
}

export async function getAllChildProducts(req: Request, res: Response) {
  try {
    const parentId = req.params.parentId;
    const queryParams = req.query as categoryQueryDto;

    const result = await Service.findAllChildProducts({
      ...queryParams,
      parentId,
    });

    return res.status(200).json({
      success: true,
      message: "Sản phẩm trong danh mục con đã được lấy thành công",
      ...result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
}
