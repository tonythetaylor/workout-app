"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackGoalProgress = exports.deleteGoal = exports.updateGoal = exports.getUserGoals = exports.createGoal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Create a new goal for a user.
 * @param userId - The ID of the user.
 * @param goalData - The goal data to be created.
 * @returns The newly created goal.
 */
const createGoal = async (userId, goalData) => {
    return prisma.goal.create({
        data: {
            ...goalData,
            userId, // Associate the goal with the user
        },
    });
};
exports.createGoal = createGoal;
/**
 * Get all goals for a specific user.
 * @param userId - The ID of the user.
 * @returns A list of goals associated with the user.
 */
const getUserGoals = async (userId) => {
    return prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getUserGoals = getUserGoals;
/**
 * Update a specific goal for a user.
 * @param goalId - The ID of the goal to update.
 * @param userId - The ID of the user who owns the goal.
 * @param goalData - The updated goal data.
 * @returns The updated goal or null if not found.
 */
const updateGoal = async (goalId, userId, goalData) => {
    return prisma.goal.updateMany({
        where: {
            id: goalId,
            userId, // Ensure the goal belongs to the user
        },
        data: goalData,
    });
};
exports.updateGoal = updateGoal;
/**
 * Delete a specific goal for a user.
 * @param goalId - The ID of the goal to delete.
 * @param userId - The ID of the user who owns the goal.
 * @returns The result of the deletion operation.
 */
const deleteGoal = async (goalId, userId) => {
    return prisma.goal.deleteMany({
        where: {
            id: goalId,
            userId, // Ensure the goal belongs to the user
        },
    });
};
exports.deleteGoal = deleteGoal;
/**
 * Track progress towards a goal.
 * @param goalId - The ID of the goal.
 * @param userId - The ID of the user.
 * @param progress - The progress value to update.
 * @returns The updated goal with progress.
 */
const trackGoalProgress = async (goalId, userId, progress) => {
    const goal = await prisma.goal.findFirst({
        where: {
            id: goalId,
            userId,
        },
    });
    if (!goal) {
        throw new Error('Goal not found');
    }
    const newProgress = (goal.currentValue || 0) + progress;
    const isAchieved = newProgress >= (goal.targetValue || 0);
    return prisma.goal.update({
        where: { id: goalId },
        data: {
            currentValue: newProgress,
            isAchieved,
        },
    });
};
exports.trackGoalProgress = trackGoalProgress;
