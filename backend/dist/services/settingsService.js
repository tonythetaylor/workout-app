"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSettings = exports.updateUserSettings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateUserSettings = async (userId, updatedInfo) => {
    return await prisma.user.update({
        where: { id: userId },
        data: updatedInfo,
    });
};
exports.updateUserSettings = updateUserSettings;
const getUserSettings = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            theme: true, // Add any other fields you want to fetch
        },
    });
};
exports.getUserSettings = getUserSettings;
