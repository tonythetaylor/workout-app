import express from 'express';
import * as goalController from '../controllers/goalController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, goalController.createGoal);
router.get('/:userId', authenticateToken, goalController.getUserGoals);
router.put('/:goalId', authenticateToken, goalController.updateGoal);
router.delete('/:goalId/:userId', authenticateToken, goalController.deleteGoal);
router.post('/progress', authenticateToken, goalController.trackProgress);

export default router;
