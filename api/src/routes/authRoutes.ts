import { Router } from 'express';
import { googleAuth, verifyGoogleToken, getCurrentUser } from '../controllers/googleAuthController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/google', googleAuth);
router.post('/verify', verifyGoogleToken);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
