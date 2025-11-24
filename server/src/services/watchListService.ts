import {addWatchListDto, getWatchListDto, removeWatchListDto} from "../dto/watchListDto";
import { prisma } from './db/prisma';

export const addWatchList = async (userId:string, data: addWatchListDto) => {
    const watchList = await prisma.watchList.create({
        data: {
            userId: userId,
            productId: data.productId,
        }
    })

    return watchList
}


export const removeWatchList = async (userId: string, data: removeWatchListDto) => {
    const watchList = await prisma.watchList.deleteMany({
        where: {
            userId: userId,
            productId: data.productId,
        }
    })

    return watchList
}


export const getWatchList = async (userId: string, query: getWatchListDto) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await prisma.watchList.findMany({
        skip,
        take: limit,
        where: {
            userId: userId, 
        },
        include: {
            product: {
                include: {
                    images: true,
                    category: true,
                    seller: true,
                }
            }
        }
    })

    return data;
}