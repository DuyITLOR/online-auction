import { Prisma } from "@prisma/client";
import { autoBidDto, computeBidDto } from "../dto/autoBidDto";
import { prisma } from "./db/prisma";

export const computerBidder = async (data: computeBidDto) => {
    const product = await prisma.products.findUnique({
        where: { id: data.productId }
    })

    if (!product) {
        throw new Error("Product not found");
    }

    const stepPrice = Number(product.stepPrice);
    const currentPrice = Number(product.currentPrice ?? product.startPrice);

    const bidder = await prisma.autoBids.findMany({
        where: {
            productId: data.productId
        }, 
        orderBy: {maxAmount : 'desc' }
    })

    if (bidder.length === 0)  return product

    const oldWinner = bidder[0];
    const oldWinnerMax = Number(oldWinner.maxAmount);

    let newPrice = currentPrice;
    let winnerId = oldWinner.bidderId;


    // Case 1: new bidder less than old winner
    if (data.newMax < oldWinnerMax){
        newPrice = Math.max(data.newMax, currentPrice);
    }
    // Case 2: new bidder equal old winner 
    else if (data.newMax == oldWinnerMax){
       newPrice = Math.max(oldWinnerMax, currentPrice);
    } 
    // Case 3: new bidder greater than old winner
    else if (data.newMax > oldWinnerMax){
        newPrice = oldWinnerMax + stepPrice;
        winnerId = data.newBidderId;
    }

    const oldPrice = Number(product.currentPrice ?? product.startPrice);
    if (newPrice > oldPrice){
        const bidHistory = await prisma.bidHistory.create({
            data: {
                productId: data.productId,
                bidderId: winnerId,
                amount: new Prisma.Decimal(newPrice)
            }
        })
    }

    return await prisma.products.update({
        where: { id: data.productId },
        data: {
            currentPrice: new Prisma.Decimal(newPrice),
            winnerId: winnerId
        }
    })
}

export const createAutoBid = async (data: autoBidDto) => {
    await prisma.autoBids.create({
        data: {
            productId: data.productId,
            bidderId: data.bidderId,
            maxAmount: new Prisma.Decimal(data.maxAutoBidAmount)
        }
    })

    return computerBidder({
        productId: data.productId,
        newBidderId: data.bidderId,
        newMax: data.maxAutoBidAmount
    })
}

export const getBidHistory = async (productId: string) => {
    const product = await prisma.products.findUnique({
        where: { id: productId }
    })
    
    if (!product) throw new Error("Product not found");
    
    return prisma.bidHistory.findMany({
        where: { productId: productId },
        orderBy: { createdAt: 'desc' },
        include: { bidder: true }
    })
}