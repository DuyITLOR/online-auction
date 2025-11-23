import { Request, Response } from 'express';
import { prisma } from '../services/db/prisma';

export async function getAllCategories(_req: Request, res: Response) {
  try {
    const categories = await prisma.categories.findMany({
      include: { children: true },
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: { children: true, products: true },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function createCategory(req: Request, res: Response) {
  const { name, parentId } = req.body;
  try {
    const category = await prisma.categories.create({
      data: { name, parentId: parentId || null },
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  const { categoryId } = req.params;
  const { name, parentId } = req.body;
  try {
    const updated = await prisma.categories.update({
      where: { id: categoryId },
      data: { name, parentId: parentId || null },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    await prisma.categories.delete({ where: { id: categoryId } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findParentCategories(_req: Request, res: Response) {
  try {
    const parents = await prisma.categories.findMany({ where: { parentId: null } });
    return res.status(200).json(parents);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findChildCategories(req: Request, res: Response) {
  const { parentId } = req.query;
  try {
    if (parentId) {
      const children = await prisma.categories.findMany({ where: { parentId: String(parentId) } });
      return res.status(200).json(children);
    }
    const allChildren = await prisma.categories.findMany({ where: { NOT: { parentId: null } } });
    return res.status(200).json(allChildren);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export async function findProductsByCategory(req: Request, res: Response) {
  const { categoryId } = req.query;
  try {
    if (!categoryId) return res.status(400).json({ error: 'categoryId query param required' });
    const products = await prisma.products.findMany({ where: { categoryId: String(categoryId) } });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
