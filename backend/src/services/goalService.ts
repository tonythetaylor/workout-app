import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new goal for a user.
 * @param userId - The ID of the user.
 * @param goalData - The goal data to be created.
 * @returns The newly created goal.
 */
export const createGoal = async (userId: number, goalData: any) => {
  return prisma.goal.create({
    data: {
      ...goalData,
      userId, // Associate the goal with the user
    },
  });
};

/**
 * Get all goals for a specific user.
 * @param userId - The ID of the user.
 * @returns A list of goals associated with the user.
 */
export const getUserGoals = async (userId: number) => {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Update a specific goal for a user.
 * @param goalId - The ID of the goal to update.
 * @param userId - The ID of the user who owns the goal.
 * @param goalData - The updated goal data.
 * @returns The updated goal or null if not found.
 */
export const updateGoal = async (goalId: number, userId: number, goalData: any) => {
  return prisma.goal.updateMany({
    where: {
      id: goalId,
      userId, // Ensure the goal belongs to the user
    },
    data: goalData,
  });
};

/**
 * Delete a specific goal for a user.
 * @param goalId - The ID of the goal to delete.
 * @param userId - The ID of the user who owns the goal.
 * @returns The result of the deletion operation.
 */
export const deleteGoal = async (goalId: number, userId: number) => {
  return prisma.goal.deleteMany({
    where: {
      id: goalId,
      userId, // Ensure the goal belongs to the user
    },
  });
};

/**
 * Track progress towards a goal.
 * @param goalId - The ID of the goal.
 * @param userId - The ID of the user.
 * @param progress - The progress value to update.
 * @returns The updated goal with progress.
 */
export const trackGoalProgress = async (goalId: number, userId: number, progress: number) => {
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
