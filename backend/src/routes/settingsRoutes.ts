import express from 'express';
import {
  updateUserInfo,
  updateUserTheme,
  deleteUserAccount,
  getUserInfo
} from '../controllers/settingsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/get-info', authenticateToken, getUserInfo);

// Update user information
router.put('/update-info', authenticateToken, updateUserInfo);

// Update theme preference
router.put('/update-theme', authenticateToken, updateUserTheme);

// Delete user account
router.delete('/delete-account', authenticateToken, deleteUserAccount);

export default router;
