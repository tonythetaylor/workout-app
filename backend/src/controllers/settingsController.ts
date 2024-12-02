import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { updateUserSettings, getUserSettings } from '../services/settingsService';

const prisma = new PrismaClient();

// Extend the Request type to include the user property
interface AuthRequest extends Request {
    user?: {
      id: number;
      email?: string;
    };
  }

  export const getUserInfo = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
         res.status(401).json({ message: 'Unauthorized' });
         return
      }
  
      const userSettings = await getUserSettings(userId);
      res.status(200).json(userSettings);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      res.status(500).json({ message: 'Failed to fetch user settings' });
    }
  };


// Update User Information
export const updateUserInfo = async (req: AuthRequest, res: Response) => {
//   const { id } = req.user; // Assuming user ID is stored in the token
  const userId = req.user?.id;

  if (!userId) {
     res.status(401).json({ message: 'Unauthorized' });
     return
  }
  try {
    const updatedSettings = req.body;
    const updatedUser = await updateUserSettings(userId, updatedSettings);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Error updating user information' });
  }
};

// Update Theme Preference
export const updateUserTheme = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { theme } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme },
    });
    res.status(200).json({ message: 'Theme updated successfully', theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ message: 'Error updating theme preference' });
  }
};

// Delete User Account
export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};
