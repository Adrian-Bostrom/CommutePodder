import { Router } from 'express';
import { getMe, toggleFavorite, toggleFavoriteRoute, updateCurrentPod } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticateJWT, getMe);
router.post('/favorites', authenticateJWT, toggleFavorite);
router.post('/favorites/routes', authenticateJWT, toggleFavoriteRoute);
router.post('/current-pod', authenticateJWT, updateCurrentPod);

export default router;

