// src/routes/userRoutes.ts
import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);

export default router;
