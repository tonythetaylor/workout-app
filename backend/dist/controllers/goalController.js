"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackProgress = exports.deleteGoal = exports.updateGoal = exports.getUserGoals = exports.createGoal = void 0;
const goalService = __importStar(require("../services/goalService"));
/**
 * Create a new goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const createGoal = async (req, res, next) => {
    const { userId, name, targetValue, unit, deadline } = req.body;
    try {
        const goal = await goalService.createGoal(userId, { name, targetValue, unit, deadline });
        res.status(201).json({ success: true, data: goal });
    }
    catch (error) {
        next(error); // Pass error to the global error handler
    }
};
exports.createGoal = createGoal;
/**
 * Get all goals for a specific user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const getUserGoals = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const goals = await goalService.getUserGoals(parseInt(userId));
        res.status(200).json({ success: true, data: goals });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserGoals = getUserGoals;
/**
 * Update a goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const updateGoal = async (req, res, next) => {
    const { goalId } = req.params;
    const { userId, ...goalData } = req.body;
    try {
        const updatedGoal = await goalService.updateGoal(parseInt(goalId), parseInt(userId), goalData);
        res.status(200).json({ success: true, data: updatedGoal });
    }
    catch (error) {
        next(error);
    }
};
exports.updateGoal = updateGoal;
/**
 * Delete a goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const deleteGoal = async (req, res, next) => {
    const { goalId, userId } = req.params;
    try {
        await goalService.deleteGoal(parseInt(goalId), parseInt(userId));
        res.status(200).json({ success: true, message: 'Goal deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteGoal = deleteGoal;
/**
 * Track progress towards a goal.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
const trackProgress = async (req, res, next) => {
    const { goalId, userId, progress } = req.body;
    try {
        const updatedGoal = await goalService.trackGoalProgress(parseInt(goalId), parseInt(userId), progress);
        res.status(200).json({ success: true, data: updatedGoal });
    }
    catch (error) {
        next(error);
    }
};
exports.trackProgress = trackProgress;
