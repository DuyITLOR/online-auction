import { createCategoryDto, updateCategoryDto } from "../dto/categoryDto";
import { prisma } from "./db/prisma";

export async function createCate(data: createCategoryDto) {
  return prisma.categories.create({
    data: { name: data.name, parentId: data.parentId || null },
  });
}

export async function updateCate(cateId: string, data: updateCategoryDto) {
  return prisma.categories.update({
    where: { id: cateId },
    data,
  });
}

export async function deleteCate(cateId: string) {
  return prisma.categories.delete({
    where: { id: cateId },
  });
}

export async function findCateById(cateId: string) {
  return prisma.categories.findUnique({
    where: { id: cateId },
  });
}

export async function findCateByName(name: string) {
  // name is not unique in schema, use findFirst to be safe
  return prisma.categories.findFirst({
    where: { name },
  });
}

export async function getAllCates() {
  return prisma.categories.findMany();
}

// Return top-level categories (parentId is null)
export async function getParentCates() {
  return prisma.categories.findMany({ where: { parentId: null } });
}

// Return child categories: if parentId provided, children of that parent; otherwise all non-root categories
export async function getChildCates(parentId?: string) {
  if (parentId) {
    return prisma.categories.findMany({ where: { parentId } });
  }
  return prisma.categories.findMany({ where: { NOT: { parentId: null } } });
}

export async function getSiblings(cateId: string) {
  const cate = await prisma.categories.findUnique({ where: { id: cateId } });
  if (!cate) return [];
  return prisma.categories.findMany({ where: { parentId: cate.parentId } });
}

export async function getProductsByCateId(cateId: string) {
  return prisma.products.findMany({
    where: { categoryId: cateId },
  });
}
