"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.updateUserTheme = exports.updateUserInfo = exports.getUserInfo = void 0;
const client_1 = require("@prisma/client");
const settingsService_1 = require("../services/settingsService");
const prisma = new client_1.PrismaClient();
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userSettings = await (0, settingsService_1.getUserSettings)(userId);
        res.status(200).json(userSettings);
    }
    catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Failed to fetch user settings' });
    }
};
exports.getUserInfo = getUserInfo;
// Update User Information
const updateUserInfo = async (req, res) => {
    //   const { id } = req.user; // Assuming user ID is stored in the token
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const updatedSettings = req.body;
        const updatedUser = await (0, settingsService_1.updateUserSettings)(userId, updatedSettings);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Error updating user information' });
    }
};
exports.updateUserInfo = updateUserInfo;
// Update Theme Preference
const updateUserTheme = async (req, res) => {
    const userId = req.user?.id;
    const { theme } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { theme },
        });
        res.status(200).json({ message: 'Theme updated successfully', theme });
    }
    catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ message: 'Error updating theme preference' });
    }
};
exports.updateUserTheme = updateUserTheme;
// Delete User Account
const deleteUserAccount = async (req, res) => {
    const userId = req.user?.id;
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        res.status(200).json({ message: 'Account deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
};
exports.deleteUserAccount = deleteUserAccount;
