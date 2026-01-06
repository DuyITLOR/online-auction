import { prisma } from "./db/prisma";

export const getAllSettings = async () => {
  try {
    return await prisma.settings.findMany();
  } catch (err) {
    throw err;
  }
};

export const createSetting = async (
  userId: string,
  key: string,
  value: string
) => {
  try {
    return await prisma.settings.create({
      data: {
        key: key,
        value: value,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const updateSetting = async (
  id: string,
  value: string,
  userId: string
) => {
  try {
    return await prisma.settings.update({
      where: { id },
      data: {
        value: value,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getSettingByKey = async (key: string) => {
  const setting = await prisma.settings.findUnique({
    where: { key },
  });
  
  if (!setting) {
    throw new Error(`Setting ${key} không tồn tại`);
  }
  
  return setting.value;
};
