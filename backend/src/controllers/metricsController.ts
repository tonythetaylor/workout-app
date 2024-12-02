import { NextFunction, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  createMetric,
  getUserMetrics,
  updateMetric,
  deleteMetric,
} from '../services/metricsService';

// Extend the Request type to include the user property
interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
  };
}

/**
 * Create a new metric
 */
export const createMetricHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ message: 'Unauthorized' });
       return
    }

    const newMetric = req.body;
    const createdMetric = await createMetric(userId, newMetric);

    res.status(201).json(createdMetric);
  } catch (error) {
    console.error('Error creating metric:', error);
    next(error); // Pass error to the middleware
  }
};

/**
 * Get all metrics for the user
 */
export const getMetricsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Set by auth middleware
    if (!userId) {
       res.status(400).json({ message: 'User ID is missing' });
       return
    }
    const metrics = await getUserMetrics(userId);
    res.json(metrics);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

/**
 * Update an existing metric
 */
export const updateMetricHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as any; // Set by auth middleware
    if (!userId) {
     res.status(400).json({ message: 'User ID is missing' });
     return
    }

    const metric = await updateMetric(Number(id), userId, req.body);
    if (metric.count === 0) {
      res.status(404).json({ error: 'Metric not found or not owned by the user' });
    } else {
      res.json({ message: 'Metric updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update metric' });
  }
};

/**
 * Delete a metric
 */
export const deleteMetricHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as number; // Set by auth middleware
    const result = await deleteMetric(Number(id), userId);
    if (result.count === 0) {
      res.status(404).json({ error: 'Metric not found or not owned by the user' });
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete metric' });
  }
};
