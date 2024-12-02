import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserSettings = async (userId: number, updatedInfo: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: updatedInfo,
  });
};

export const getUserSettings = async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        theme: true, // Add any other fields you want to fetch
      },
    });
}
