import {
  createProductDto,
  productQueryDto,
  updateProductDto,
} from "../dto/productDto";
import { prisma } from "../services/db/prisma";
import { Prisma } from "@prisma/client";

export const createProduct = async (id: string, data: createProductDto) => {
  const product = await prisma.products.create({
    data: {
      sellerId: id,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,

      startPrice: new Prisma.Decimal(data.startPrice),
      stepPrice: new Prisma.Decimal(data.stepPrice),
      buyNowPrice: new Prisma.Decimal(data.buyNowPrice),

      startedAt: new Date(data.startedAt),
      endAt: new Date(data.endAt),

      autoExtendEnabled: data.autoExtendEnabled ?? false,
      autoExtendMinutes: data.autoExtendMinutes ?? 0,
      highRatingRequired: data.highRatingRequired ?? false,

      images: {
        create: data.images.map((img) => ({
          url: img.url,
          sortOrder: img.sortOrder,
        })),
      },
    },
    include: {
      images: true,
    },
  });

  return product;
};

export const getProductById = async (productId: string) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      seller: true,
      images: true,
      category: true,
    },
  });
  return product;
};

export const updateProduct = async (id: string, data: updateProductDto) => {
  const updateData: Partial<Prisma.ProductsUpdateInput> = {};
  if (data.categoryId !== undefined)
    updateData.category = { connect: { id : data.categoryId } };
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;

  if (data.startPrice !== undefined)
    updateData.startPrice = new Prisma.Decimal(data.startPrice);

  if (data.stepPrice !== undefined)
    updateData.stepPrice = new Prisma.Decimal(data.stepPrice);

  if (data.buyNowPrice !== undefined)
    updateData.buyNowPrice = new Prisma.Decimal(data.buyNowPrice);

  if (data.startedAt !== undefined)
    updateData.startedAt = new Date(data.startedAt);

  if (data.endAt !== undefined) updateData.endAt = new Date(data.endAt);

  if (data.autoExtendEnabled !== undefined)
    updateData.autoExtendEnabled = data.autoExtendEnabled;

  if (data.autoExtendMinutes !== undefined)
    updateData.autoExtendMinutes = data.autoExtendMinutes;

  if (data.highRatingRequired !== undefined)
    updateData.highRatingRequired = data.highRatingRequired;

  if (data.images !== undefined) {
    updateData.images = {
      deleteMany: {},
      create: data.images.map((img) => ({
        url: img.url,
        sortOrder: img.sortOrder,
      })),
    };
  }

  const updatedProduct = await prisma.products.update({
    where: { id },
    data: updateData,
    include: {
      images: true,
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
  return prisma.products.delete({
    where: { id: productId },
  });
};

export const searchProducts = async (query: productQueryDto) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductsWhereInput = {};

  if (query.q) {
    where.title = {
      contains: query.q,
      mode: "insensitive",
    };
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  let orderBy: Prisma.ProductsOrderByWithRelationInput = {};

  switch (query.sort) {
    case "price_asc":
        orderBy = { currentPrice: "asc" };
        break;
    case "price_desc":
        orderBy = { currentPrice: "desc" };
        break;
    case "endAt_asc":
        orderBy = { endAt: "asc" };
        break;
    case "endAt_desc":
        orderBy = { endAt: "desc" };
        break;
    default:
        orderBy = { startedAt: "desc" };
        break;
  }

  const products = await prisma.products.findMany({
    where, 
    skip,
    take: limit,
    orderBy,
    include: {
      images: true,
    },
  })

   const total = await prisma.products.count({ where });

   return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: products,
   }
};
