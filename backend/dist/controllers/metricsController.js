"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMetricHandler = exports.updateMetricHandler = exports.getMetricsHandler = exports.createMetricHandler = void 0;
const metricsService_1 = require("../services/metricsService");
/**
 * Create a new metric
 */
const createMetricHandler = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const newMetric = req.body;
        const createdMetric = await (0, metricsService_1.createMetric)(userId, newMetric);
        res.status(201).json(createdMetric);
    }
    catch (error) {
        console.error('Error creating metric:', error);
        next(error); // Pass error to the middleware
    }
};
exports.createMetricHandler = createMetricHandler;
/**
 * Get all metrics for the user
 */
const getMetricsHandler = async (req, res) => {
    try {
        const userId = req.user?.id; // Set by auth middleware
        if (!userId) {
            res.status(400).json({ message: 'User ID is missing' });
            return;
        }
        const metrics = await (0, metricsService_1.getUserMetrics)(userId);
        res.json(metrics);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};
exports.getMetricsHandler = getMetricsHandler;
/**
 * Update an existing metric
 */
const updateMetricHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Set by auth middleware
        if (!userId) {
            res.status(400).json({ message: 'User ID is missing' });
            return;
        }
        const metric = await (0, metricsService_1.updateMetric)(Number(id), userId, req.body);
        if (metric.count === 0) {
            res.status(404).json({ error: 'Metric not found or not owned by the user' });
        }
        else {
            res.json({ message: 'Metric updated successfully' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update metric' });
    }
};
exports.updateMetricHandler = updateMetricHandler;
/**
 * Delete a metric
 */
const deleteMetricHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Set by auth middleware
        const result = await (0, metricsService_1.deleteMetric)(Number(id), userId);
        if (result.count === 0) {
            res.status(404).json({ error: 'Metric not found or not owned by the user' });
        }
        else {
            res.status(204).send(); // No content
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete metric' });
    }
};
exports.deleteMetricHandler = deleteMetricHandler;
