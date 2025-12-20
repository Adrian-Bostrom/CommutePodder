import { Router } from 'express';
import { getMe, toggleFavorite, toggleFavoriteRoute } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticateJWT, getMe);
router.post('/favorites', authenticateJWT, toggleFavorite);
router.post('/favorites/routes', authenticateJWT, toggleFavoriteRoute);

export default router;

