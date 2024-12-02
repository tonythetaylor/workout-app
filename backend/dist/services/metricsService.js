"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMetric = exports.updateMetric = exports.getUserMetrics = exports.createMetric = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Create a new metric for a specific user.
 * @param userId - The ID of the user.
 * @param metricData - The metric data to be created.
 * @returns The newly created metric.
 */
const createMetric = async (userId, metricData) => {
    return prisma.dailyMetrics.create({
        data: {
            ...metricData,
            userId, // Associate metric with the user
        },
    });
};
exports.createMetric = createMetric;
/**
 * Get all metrics for a specific user.
 * @param userId - The ID of the user.
 * @returns A list of metrics associated with the user.
 */
const getUserMetrics = async (userId) => {
    return prisma.dailyMetrics.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }, // Sort by the most recent metrics
    });
};
exports.getUserMetrics = getUserMetrics;
/**
 * Update a specific metric for a user.
 * @param id - The ID of the metric to update.
 * @param userId - The ID of the user who owns the metric.
 * @param metricData - The updated metric data.
 * @returns The updated metric or null if not found.
 */
const updateMetric = async (id, userId, metricData) => {
    return prisma.dailyMetrics.updateMany({
        where: {
            id,
            userId, // Ensure the metric belongs to the user
        },
        data: metricData,
    });
};
exports.updateMetric = updateMetric;
/**
 * Delete a specific metric for a user.
 * @param id - The ID of the metric to delete.
 * @param userId - The ID of the user who owns the metric.
 * @returns The result of the deletion operation.
 */
const deleteMetric = async (id, userId) => {
    return prisma.dailyMetrics.deleteMany({
        where: {
            id,
            userId, // Ensure the metric belongs to the user
        },
    });
};
exports.deleteMetric = deleteMetric;
