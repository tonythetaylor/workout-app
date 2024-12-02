import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new metric for a specific user.
 * @param userId - The ID of the user.
 * @param metricData - The metric data to be created.
 * @returns The newly created metric.
 */
export const createMetric = async (userId: number, metricData: any) => {
  return prisma.dailyMetrics.create({
    data: {
      ...metricData,
      userId, // Associate metric with the user
    },
  });
};

/**
 * Get all metrics for a specific user.
 * @param userId - The ID of the user.
 * @returns A list of metrics associated with the user.
 */
export const getUserMetrics = async (userId: number) => {
  return prisma.dailyMetrics.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }, // Sort by the most recent metrics
  });
};

/**
 * Update a specific metric for a user.
 * @param id - The ID of the metric to update.
 * @param userId - The ID of the user who owns the metric.
 * @param metricData - The updated metric data.
 * @returns The updated metric or null if not found.
 */
export const updateMetric = async (id: number, userId: number, metricData: any) => {
  return prisma.dailyMetrics.updateMany({
    where: {
      id,
      userId, // Ensure the metric belongs to the user
    },
    data: metricData,
  });
};

/**
 * Delete a specific metric for a user.
 * @param id - The ID of the metric to delete.
 * @param userId - The ID of the user who owns the metric.
 * @returns The result of the deletion operation.
 */
export const deleteMetric = async (id: number, userId: number) => {
  return prisma.dailyMetrics.deleteMany({
    where: {
      id,
      userId, // Ensure the metric belongs to the user
    },
  });
};
