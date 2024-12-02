"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const metricsController_1 = require("../controllers/metricsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticateToken, metricsController_1.createMetricHandler); // Add new metric
router.get('/', authMiddleware_1.authenticateToken, metricsController_1.getMetricsHandler); // Get all metrics
router.put('/:id', authMiddleware_1.authenticateToken, metricsController_1.updateMetricHandler); // Update metric
router.delete('/:id', authMiddleware_1.authenticateToken, metricsController_1.deleteMetricHandler); // Delete metric
exports.default = router;
