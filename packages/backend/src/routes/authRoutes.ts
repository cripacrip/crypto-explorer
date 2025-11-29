import { Router } from 'express';

import { getMe, logOut, login, register } from '../controllers/authController';
import { authenticateJwt } from '../middleware/authenticateJwt';

const router = Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/me', authenticateJwt, getMe);
router.post('/logout', authenticateJwt, logOut);

export default router;
