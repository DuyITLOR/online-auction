import { Request, Response } from "express";
import * as Service from "../services/cateService";
import { createCategoryDto, updateCategoryDto } from "../dto/categoryDto";
import { checkRole } from "../utils/checkRole";

export async function createCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes('ADMIN')) {
      return res.status(403).json({ error: "Forbidden. Admins only." });
    }

    const body: createCategoryDto = req.body;
    const category = await Service.createCate(body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes('ADMIN')) {
      return res.status(403).json({ error: "Forbidden. Admins only." });
    }

    const { categoryId } = req.params;
    const body: updateCategoryDto = req.body;
    const updated = await Service.updateCate(categoryId, body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const userID = req.user!.id;
    let roles = await checkRole(userID);
    if (!roles.includes('ADMIN')) {
      return res.status(403).json({ error: "Forbidden. Admins only." });
    }
    const { categoryId } = req.params;
    await Service.deleteCate(categoryId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    const category = await Service.getProductsByCateId(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getAllCategories(_req: Request, res: Response) {
  try {
    const categories = await Service.getAllCates();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findParentCategories(_req: Request, res: Response) {
  try {
    const parents = await Service.getParentCates();
    return res.status(200).json(parents);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findChildCategories(_req: Request, res: Response) {
  try {
    const allChildren = await Service.getChildCates();
    return res.status(200).json(allChildren);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findSiblings(req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    const siblings = await Service.getSiblings(categoryId);
    return res.status(200).json(siblings);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findProductsByCategory(req: Request, res: Response) {
  const { categoryId } = req.query;
  try {
    if (!categoryId)
      return res.status(400).json({ error: "categoryId query param required" });
    const products = await Service.getProductsByCateId(String(categoryId));
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
