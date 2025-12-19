import { Router } from 'express';
import { getMe, toggleFavorite } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticateJWT, getMe);
router.post('/favorites', authenticateJWT, toggleFavorite);

export default router;

