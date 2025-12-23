import {
  createProductDto,
  productQueryDto,
  updateProductDto,
  buyNowProuctDto,
} from "../dto/productDto";
import { prisma } from "./db/prisma";
import { Prisma } from "@prisma/client";

export const createProduct = async (id: string, data: createProductDto) => {
  console.log("Time to expired the product: ", data.endAt);
  const product = await prisma.products.create({
    data: {
      sellerId: id,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,

      startPrice: new Prisma.Decimal(data.startPrice),
      currentPrice: new Prisma.Decimal(data.startPrice),
      stepPrice: new Prisma.Decimal(data.stepPrice),
      buyNowPrice: new Prisma.Decimal(data.buyNowPrice),

      startedAt: new Date(),
      endAt: new Date(data.endAt),
      updatedAt: new Date(),

      autoExtendEnabled: data.autoExtendEnabled === "true",
      autoExtendMinutes: Number(data.autoExtendMinutes) ?? 0,
      highRatingRequired: data.highRatingRequired === "true",

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

  return product.autoExtendEnabled;
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
    updateData.category = { connect: { id: data.categoryId } };
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) {
    const old = await prisma.products.findUnique({
      where: { id },
      select: { description: true },
    });

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    updateData.description = `${
      old?.description ?? " "
    }  \n\n[Cập nhật ngày ${formattedDate}]: \n\n${data.description}`;
  }

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

  updateData.updatedAt = new Date();

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

  if (query.sellerId) {
    where.sellerId = query.sellerId;
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
    case "countBids_desc":
      orderBy = { countbids: "desc" };
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
      seller: true,
      category: true,
    },
  });

  const total = await prisma.products.count({ where });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: products,
  };
};

export const buyNowProuct = async (bidderId: string, data: buyNowProuctDto) => {
  const timeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.products.findUnique({
        where: { id: data.productId },
      });

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      if (product.sellerId === bidderId) {
        throw new Error("Người bán không thể mua ngay sản phẩm của chính mình");
      }

      if (product.status !== "ACTIVE") {
        throw new Error("Sản phẩm không khả dụng để mua ngay");
      }

      if (product.buyNowPrice === null) {
        throw new Error("Sản phẩm không có giá mua ngay");
      }

      try {
        const order = await tx.orders.create({
          data: {
            productId: data.productId,
            buyerId: bidderId,
            phoneNumber: data.phoneNumber,
            totalAmount: new Prisma.Decimal(product.buyNowPrice),
            status: "UNPAID",
            paymentStatus: "PENDING",
            shippingAddress: data.shippingAddress,
            paymentDueAt: new Date(Date.now() + timeout),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          include: {
            product: {
              include: {
                seller: true,
              },
            },
            buyer: true,
          },
        });

        await tx.products.update({
          where: { id: data.productId },
          data: {
            status: "SOLD",
            winnerId: bidderId,
            updatedAt: new Date(),
          },
        });

        return order;
      } catch (err: any) {
        // Đụng độ khi dùng unique mà có thêm record thứ hai được tạo
        if (err?.code === "P2002" || err?.code === "23505") {
          const exits = await tx.orders.findUnique({
            where: { productId: data.productId },
          });

          if (exits) throw new Error("Đã có người mua thành công");
        }
      }
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getExpiredActiveProducts = async () => {
  const products = await prisma.products.findMany({
    where: { status: "ACTIVE", endAt: { lte: new Date() } },
  });

  if (!products) {
    throw new Error("Không tìm thấy sản phẩm nào");
  }

  return products;
};

export const handleAuctionEnd = async (productId: string) => {
  const product = await prisma.$transaction(async (tx) => {
    const exitOrder = await tx.orders.findUnique({
      where: { productId: productId },
    });

    if (exitOrder) {
      return null;
    }
    await tx.products.update({
      where: { id: productId, status: "ACTIVE" },
      data: {
        status: "SOLD",
        updatedAt: new Date(),
      },
    });

    return await tx.products.findUnique({
      where: { id: productId },
      include: {
        seller: true,
      },
    });
  });

  if (!product) {
    throw new Error(`Không tìm thấy sản phẩm với productId ${productId}`);
  }

  // Nếu không có người mua
  if (product.winnerId === null) {
    return {
      type: "NO_BIDDER",
      product: product,
    };
  }

  const timeout = 24 * 60 * 60 * 1000;
  const order = await prisma.orders.create({
    data: {
      productId: productId,
      buyerId: product.winnerId,
      totalAmount: new Prisma.Decimal(product.buyNowPrice),
      status: "UNPAID",
      paymentStatus: "PENDING",
      paymentDueAt: new Date(Date.now() + timeout),
      createdAt: new Date(),
    },
    include: {
      buyer: true,
    },
  });

  if (!order) {
    throw new Error("Tạo đơn hàng thất bại");
  }

  return {
    type: "HAS_BIDDER",
    product: product,
    order: order,
  };
};
