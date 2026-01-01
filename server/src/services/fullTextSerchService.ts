import { prisma } from './db/prisma';
import { fullTextSearchDto } from '../dto/fullTextSearchDto';

export const fullTextSearchService = async (data: fullTextSearchDto) => {
  const { query, limit } = data;
    const results = await prisma.products.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        take: limit ?? 10,
    });
    return results;
};
