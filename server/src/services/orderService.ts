import { orderQueryDto } from "../dto/orderDto";
import { prisma } from "./db/prisma";
import { Prisma } from "@prisma/client";
export const getOrdersByQuery = async (role: string, query: orderQueryDto) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.OrdersWhereInput = {};

  if (query.userId && role === "BIDDER") {
    where.buyerId = query.userId;
  } else if (query.userId && role === "SELLER") {
    where.product = { sellerId: query.userId };
  } else if (query.userId && role === "ADMIN") {
  } else {
    throw new Error("Thiếu role không thể truy cập");
  }

  const q = (query.q ?? "").trim();
  if (q) {
    const productWhere : Prisma.ProductsWhereInput = where.product ?? {};
    where.product = {
      ...productWhere,
      title: {
        contains: q,
        mode: "insensitive",
      },
    };
  }

  let selectByRole: Prisma.OrdersSelect;
  if (role === "ADMIN") {
    selectByRole = {
      id: true,
      totalAmount: true,
      status: true,
      product: {
        select: { title: true, seller: { select: { fullname: true } } },
      },
      buyer: { select: { fullname: true } },
    };
  } else if (role === "BIDDER") {
    selectByRole = {
      id: true,
      totalAmount: true,
      status: true,
      product: {
        select: { title: true, seller: { select: { fullname: true } } },
      },
    };
  } else if (role === "SELLER") {
    selectByRole = {
      id: true,
      totalAmount: true,
      status: true,
      product: {
        select: { title: true },
      },
      buyer: { select: { fullname: true } },
    };
  } else {
    throw new Error("Role không hợp lệ");
  }

  const data = await prisma.orders.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: selectByRole,
  });

  const total = await prisma.orders.count({ where });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: data,
  };
};
