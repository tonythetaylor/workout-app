import { NextFunction, Request, Response } from 'express';
import * as goalService from '../services/goalService';

/**
 * Create a new goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, name, targetValue, unit, deadline } = req.body;

  try {
    const goal = await goalService.createGoal(userId, { name, targetValue, unit, deadline });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

/**
 * Get all goals for a specific user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const getUserGoals = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const goals = await goalService.getUserGoals(parseInt(userId));
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
  const { goalId } = req.params;
  const { userId, ...goalData } = req.body;

  try {
    const updatedGoal = await goalService.updateGoal(parseInt(goalId), parseInt(userId), goalData);
    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a goal for a user.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  const { goalId, userId } = req.params;

  try {
    await goalService.deleteGoal(parseInt(goalId), parseInt(userId));
    res.status(200).json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Track progress towards a goal.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const trackProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { goalId, userId, progress } = req.body;

  try {
    const updatedGoal = await goalService.trackGoalProgress(parseInt(goalId), parseInt(userId), progress);
    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    next(error);
  }
};
