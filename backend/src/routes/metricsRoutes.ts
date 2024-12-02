import express from 'express';
import {
  createMetricHandler,
  getMetricsHandler,
  updateMetricHandler,
  deleteMetricHandler,
} from '../controllers/metricsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createMetricHandler); // Add new metric
router.get('/', authenticateToken, getMetricsHandler); // Get all metrics
router.put('/:id', authenticateToken, updateMetricHandler); // Update metric
router.delete('/:id', authenticateToken, deleteMetricHandler); // Delete metric

export default router;
