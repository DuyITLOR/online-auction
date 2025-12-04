import { Prisma } from "@prisma/client";
import { autoBidDto, computeBidDto } from "../dto/autoBidDto";
import { prisma } from "./db/prisma";
import { getProductById } from "./productService";
import { checkRating } from "./userService";
import { getBlockUserByProductId } from "./userService";

export const computerBidder = async (data: computeBidDto) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.products.findUnique({
      where: { id: data.productId },
      include: { autoBids: true },
    });

    if (!product) throw new Error("Product not found");

    const stepPrice = Number(product.stepPrice);
    const startPrice = Number(product.startPrice);
    const currentPrice = Number(product.currentPrice ?? startPrice);

    const bids = product.autoBids.sort((a, b) => {
      const diff = Number(b.maxAmount) - Number(a.maxAmount);
      if (diff !== 0) return diff;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    const lastHistory = await tx.bidHistory.findFirst({
      where: { productId: data.productId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastHistory) {
      // Create history
      await tx.bidHistory.create({
        data: {
          productId: data.productId,
          bidderId: data.newBidderId,
          amount: new Prisma.Decimal(startPrice),
        },
      });
      let countBids = await getBidCountByProductId(data.productId);

      if (!countBids) countBids = 0;

      // Update product
      return await tx.products.update({
        where: { id: data.productId },
        data: {
          currentPrice: new Prisma.Decimal(startPrice),
          winnerId: data.newBidderId,
          countbids: countBids,
        },
      });
    }

    let firstBidder = bids[0];
    let secondBidder = bids[1];

    let winnerId = firstBidder.bidderId;
    let newPrice = currentPrice;

    if (!secondBidder) {
      // Only one bidder
      newPrice = Math.max(currentPrice, startPrice);
    } else {
      // Greater than second bidder
      const maxFirst = Number(firstBidder.maxAmount);
      const maxSecond = Number(secondBidder.maxAmount);
      const maxNew = Number(data.newMax);

      if (maxFirst === maxSecond) {
        newPrice = maxFirst;
        winnerId = firstBidder.bidderId;
      } else {
        if (firstBidder.bidderId === data.newBidderId) {
          const temp = maxSecond + stepPrice;
          const target = Math.min(temp, maxNew);

          newPrice = Math.max(currentPrice, target);
          winnerId = firstBidder.bidderId;
        } else {
          if (maxNew > currentPrice) {
            newPrice = maxNew;
          } else newPrice = currentPrice;

          winnerId = firstBidder.bidderId;
        }
      }
    }
    const last = await tx.bidHistory.findFirst({
      where: { productId: data.productId },
      orderBy: { createdAt: "desc" },
    });

    if (newPrice > currentPrice && Number(last?.amount) !== newPrice) {
      // Create history
      try {
        await tx.bidHistory.create({
          data: {
            productId: data.productId,
            bidderId: winnerId,
            amount: new Prisma.Decimal(newPrice),
          },
        });
      } catch (error) {
        console.error("Error creating bid history:", error);
        // throw new Error("Failed to create bid history");
      }
    }

    let countBids = await tx.bidHistory.count({
      where: { productId: data.productId },
    });

    if (!countBids) countBids = 0;

    // Update product
    return await tx.products.update({
      where: { id: data.productId },
      data: {
        currentPrice: new Prisma.Decimal(startPrice),
        winnerId: data.newBidderId,
        countbids: countBids,
      },
    });
  });
};

export const createAutoBid = async (data: autoBidDto) => {
  const product = await getProductById(data.productId);
  if (!product) throw new Error("Product not found");

  // if (product?.winnerId === data.bidderId) {
  //   throw new Error("You are already the highest bidder");
  // }

  const checkValid = await validationAutoBid(data);
  if (!checkValid) throw new Error("Auto bid validation failed");

  await prisma.autoBids.upsert({
    where: {
      productId_bidderId: {
        productId: data.productId,
        bidderId: data.bidderId,
      },
    },
    update: {
      maxAmount: new Prisma.Decimal(data.maxAutoBidAmount),
    },
    create: {
      productId: data.productId,
      bidderId: data.bidderId,
      maxAmount: new Prisma.Decimal(data.maxAutoBidAmount),
    },
  });

  return computerBidder({
    productId: data.productId,
    newBidderId: data.bidderId,
    newMax: data.maxAutoBidAmount,
  });
};

export const getBidHistory = async (productId: string) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  return prisma.bidHistory.findMany({
    where: { productId: productId },
    orderBy: { amount: "desc" },
    include: { bidder: true },
  });
};

export const validationAutoBid = async (data: autoBidDto) => {
  const product = await getProductById(data.productId);
  // Check product exists
  if (!product) throw new Error("Product not found");

  // Check user exists
  if (!data.bidderId) throw new Error("Bidder not found");

  // Check blocked user
  const blockUsers = await getBlockUserByProductId(data.productId);

  if (blockUsers.includes(data.bidderId)) {
    throw new Error("You are blocked from bidding on this product");
  }

  // Check product is active
  const now = new Date();
  if (product.startedAt > now || product.endAt <= now) {
    throw new Error("Product is not active for bidding");
  }

  // Check owner
  if (product.sellerId === data.bidderId) {
    throw new Error("Owner cannot bid on their own product");
  }

  // Check hightRating
  if (product.highRatingRequired) {
    const check = await checkRating(data.bidderId);
    // console.log("check rating in auto bid:", check);
    if (!check) throw new Error("Cannot bid because you have low rating");
  }

  const stepPrice = Number(product.stepPrice);
  const currentPrice = Number(product.currentPrice ?? product.startPrice);

  if (data.maxAutoBidAmount < currentPrice + stepPrice) {
    throw new Error("The amount was not enough to bid");
  }

  return true;
};

export const getBidCountByProductId = async (productId: string) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  const count = await prisma.bidHistory.count({
    where: { productId },
  });
  return count;
};

export const getMaxBidByUserId = async (productId: string, userId: string) => {
  const autoBid = await prisma.autoBids.findUnique({
    where: {
      productId_bidderId: {
        productId,
        bidderId: userId,
      },
    },
  });

  if (!autoBid) throw new Error("Auto bid not found");

  return autoBid.maxAmount;
};
