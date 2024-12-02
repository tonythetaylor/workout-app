"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/get-info', authMiddleware_1.authenticateToken, settingsController_1.getUserInfo);
// Update user information
router.put('/update-info', authMiddleware_1.authenticateToken, settingsController_1.updateUserInfo);
// Update theme preference
router.put('/update-theme', authMiddleware_1.authenticateToken, settingsController_1.updateUserTheme);
// Delete user account
router.delete('/delete-account', authMiddleware_1.authenticateToken, settingsController_1.deleteUserAccount);
exports.default = router;
