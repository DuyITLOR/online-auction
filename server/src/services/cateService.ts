import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createCate(data: { name: string, parentId?: string }) {
    return prisma.cate.create({
        data: { name: data.name, parentId: data.parentId },
    });
}

export async function findCateById(cateId: string) {
  return prisma.cate.findUnique({
    where: { id: cateId },
  });
}
export async function findCateByName(name: string) {
    return prisma.cate.findUnique({
        where: { name },
    });
}
export async function getAllCates() {
    return prisma.cate.findMany();
}

export async function getParentCates( cateId: string) {
    return prisma.cate.findMany({
        where: { parentId: cateId },
    });
}

export async function getChildCates( cateId: string) {
    return prisma.cate.findMany({
        where: { parentId: cateId },
    });
}

export async function getProductsByCateId(cateId: string) {
    return prisma.product.findMany({
        where: { cateId },
    });
}

export async function updateCate(cateId: string, data: { name?: string, parentId?: string }) {
    return prisma.cate.update({
        where: { id: cateId },
        data,
    });
}   

export async function deleteCate(cateId: string) {
    return prisma.cate.delete({
        where: { id: cateId },
    });
}


