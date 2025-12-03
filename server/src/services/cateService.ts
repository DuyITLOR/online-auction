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
    data,
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

  const childCate = await prisma.categories.findMany({
    where: { parentId: cateId },
  });

  const products = await prisma.products.findMany({
    where: {
      OR: [
        { categoryId: cateId },
        { categoryId: { in: childCate.map((cate) => cate.id) } },
      ],
    },
  });
  if (products.length > 0) {
    throw new Error(
      "Cannot delete category. There are products assigned to this category or its subcategories."
    );
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

export async function findAllChildProducts(query: categoryQueryDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // 1) Lấy category con
  const childCate = await prisma.categories.findMany({
    where: { parentId: query.parentId },
    select: { id: true },
  });

  if (childCate.length === 0) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      data: [],
    };
  }

  const childIds = childCate.map((c) => c.id);

  // 2) Tổng số products
  const total = await prisma.products.count({
    where: { categoryId: { in: childIds } },
  });

  // 3) Query với skip & limit
  const data = await prisma.products.findMany({
    where: { categoryId: { in: childIds } },
    skip,
    take: limit,
  });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
}
