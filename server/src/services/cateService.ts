import {
  createCategoryDto,
  updateCategoryDto,
  categoryQueryDto,
} from "../dto/categoryDto";
import { prisma } from "./db/prisma";

export async function createCate(data: createCategoryDto) {
  return prisma.categories.create({
    data: { name: data.name, parentId: data.parentId || null },
  });
}

export async function updateCate(cateId: string, data: updateCategoryDto) {
  return prisma.categories.update({
    where: { id: cateId },
    data: { name: data.name },
  });
}

export async function deleteCate(cateId: string) {
  console.log("Deleting category with IDD:", cateId);
  // Ensure category exists
  const existing = await prisma.categories.findUnique({
    where: { id: cateId },
  });
  if (!existing) {
    throw new Error("Category not found");
  }

  // Prevent deletion if products are still assigned to this category
  const productCount = await prisma.products.count({
    where: { categoryId: cateId },
  });
  if (productCount > 0) {
    throw new Error("Category has products and cannot be deleted");
  }

  // Safe to delete
  const deleted = await prisma.categories.delete({ where: { id: cateId } });
  return deleted;
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

export async function SearchCategories(parents?: string) {
  // TRƯỜNG HỢP 1: url/categories (parents là undefined)
  // => Trả về tất cả danh mục
  if (parents === undefined) {
    return prisma.categories.findMany();
  }

  // TRƯỜNG HỢP 2: url/categories?parents (parents là chuỗi rỗng "")
  // => Trả về các danh mục gốc (parentId là null)
  if (parents === "") {
    return prisma.categories.findMany({
      where: { parentId: null },
    });
  }

  // TRƯỜNG HỢP 3: url/categories?parents=someId (parents là chuỗi ID)
  // => Trả về các danh mục con của ID đó
  return prisma.categories.findMany({
    where: { parentId: parents },
  });
}
