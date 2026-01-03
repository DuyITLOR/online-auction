import { orderQueryDto } from "../dto/orderDto";
import { ratingDto } from "../dto/ratingDto";
import { prisma } from "./db/prisma";
import { Prisma } from "@prisma/client";
import * as orderDto from "../dto/orderDto";
import * as ratingService from "./ratingService";

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
    const productWhere: Prisma.ProductsWhereInput = where.product ?? {};
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
      createdAt: true,
      product: {
        select: {
          id: true,
          title: true,
          seller: { select: { fullname: true } },
        },
      },
      buyer: { select: { fullname: true } },
    };
  } else if (role === "BIDDER") {
    selectByRole = {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          title: true,
          seller: { select: { fullname: true } },
        },
      },
    };
  } else if (role === "SELLER") {
    selectByRole = {
      id: true,
      totalAmount: true,
      status: true,
      product: {
        select: { id: true, title: true },
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

export const getCompletedOrder = async (userId: string) => {
  try {
    return await prisma.orders.findMany({
      where: {
        sellerId: userId,
        status: "WAIT_REVIEW",
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getCountOrderByUser = async (userId: string) => {
  const count = await prisma.orders.count({
    where: { buyerId: userId },
  });

  return count;
};

export const getOrderByProductId = async (productId: string) => {
  try {
    return await prisma.orders.findUnique({
      where: {
        productId,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const createOrder = async (productId: string) => {
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
      sellerId: product.sellerId,
      totalAmount: new Prisma.Decimal(product.currentPrice|| 0),
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

export const getOrderById = async (orderId: string, userId: string) => {
  return prisma.orders.findFirst({
    where: {
      id: orderId,
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    select: {
      id: true,
      totalAmount: true,
      productId: true,
      status: true,
      sellerId: true,
      buyerId: true,
      qrInfo: true,
      qrUrl: true,
      buyerAddress: true,
      buyerPhone: true,
      billUrl: true,
      shippingCode: true,
      shippingUrl: true,
      product: {
        select: {
          title: true,
        },
      },
      buyer: {
        select: {
          fullname: true,
        },
      },
      seller: {
        select: {
          fullname: true,
        },
      },
    },
  });
};

export const uploadBankInfo = async (bankInfo: orderDto.orderBankInfo) => {
  const exit = await prisma.orders.findUnique({
    where: {
      id: bankInfo.orderId,
      sellerId: bankInfo.sellerId,
      status: "WAIT_SELLER_BANK_INFO",
    },
    select: {
      id: true,
    },
  });

  if (!exit) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return prisma.orders.update({
    where: {
      id: bankInfo.orderId,
      sellerId: bankInfo.sellerId,
    },
    data: {
      qrUrl: bankInfo.qrUrl,
      qrInfo: bankInfo.bankInfor,
      status: "WAIT_BUYER_PAYMENT",
    },

    select: {
      id: true,
      qrUrl: true,
      qrInfo: true,
      status: true,
    },
  });
};

export const uploadPayment = async (
  paymentInfor: orderDto.orderPaymentInfo
) => {
  const exit = await prisma.orders.findUnique({
    where: {
      id: paymentInfor.orderId,
      buyerId: paymentInfor.buyerId,
      status: "WAIT_BUYER_PAYMENT",
    },
    select: {
      id: true,
    },
  });

  if (!exit) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return prisma.orders.update({
    where: {
      id: paymentInfor.orderId,
      buyerId: paymentInfor.buyerId,
    },
    data: {
      buyerAddress: paymentInfor.buyerAddress,
      buyerPhone: paymentInfor.buyerPhone,
      billUrl: paymentInfor.billUrl,
      status: "WAIT_SELLER_SHIPPING",
    },

    select: {
      id: true,
      buyerAddress: true,
      buyerPhone: true,
      billUrl: true,
      status: true,
    },
  });
};

export const uploadShippingInfo = async (
  shippingInfor: orderDto.orderShippingInfo
) => {
  const exit = await prisma.orders.findUnique({
    where: {
      id: shippingInfor.orderId,
      sellerId: shippingInfor.sellerId,
      status: "WAIT_SELLER_SHIPPING",
    },
    select: {
      id: true,
    },
  });

  if (!exit) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return prisma.orders.update({
    where: {
      id: shippingInfor.orderId,
      sellerId: shippingInfor.sellerId,
    },
    data: {
      shippingCode: shippingInfor.shippingCode,
      shippingUrl: shippingInfor.shippingUrl,
      status: "WAIT_BUYER_CONFIRM_RECEIVE",
    },
  });
};

export const confirmReceive = async (orderId: string, buyerId: string) => {
  const exit = await prisma.orders.findUnique({
    where: {
      id: orderId,
      buyerId: buyerId,
      status: "WAIT_BUYER_CONFIRM_RECEIVE",
    },
    select: {
      id: true,
    },
  });

  if (!exit) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return prisma.orders.update({
    where: {
      id: orderId,
      buyerId: buyerId,
    },
    data: {
      status: "WAIT_REVIEW",
      isReceived: true,
      receivedAt: new Date(),
    },
  });
};

export const cancelOrder = async (cancelInfor: orderDto.orderCancelInfo) => {
  const exit = await prisma.orders.findUnique({
    where: {
      id: cancelInfor.orderId,
      buyerId: cancelInfor.buyerId,
      sellerId: cancelInfor.sellerId,
    },
    select: {
      id: true,
    },
  });
  
  if (!exit) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return await prisma.$transaction(async (tx) => {
    const updateOrder = await tx.orders.update({
      where: {
        id: cancelInfor.orderId,
        buyerId: cancelInfor.buyerId,
        sellerId: cancelInfor.sellerId,
      },
      data: {
        status: "CANCELLED",
        cancelReason: cancelInfor.reason,
      },
    });

    const rated = await tx.ratings.findFirst({
      where: {
        raterId: cancelInfor.sellerId,
        rateeId: cancelInfor.buyerId,
        productId: cancelInfor.productId,
      },
      select: { id: true },
    });

    if (rated) {
      throw new Error("Bạn đã đánh giá người này rồi");
    }

    if (!rated) {
      await tx.user.update({
        where: { id: cancelInfor.buyerId },
        data: {
          ratingNeg: { increment: 1 },
        },
      });

      await tx.ratings.create({
        data: {
          raterId: cancelInfor.sellerId,
          rateeId: cancelInfor.buyerId,
          productId: cancelInfor.productId,
          value: -1,
          comment: cancelInfor.reason,
        },
      });
    }

    return updateOrder;
  });
};
