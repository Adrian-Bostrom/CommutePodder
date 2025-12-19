import { Router } from 'express';
import { googleAuth, verifyGoogleToken } from '../controllers/googleAuthController.js';

const router = Router();

router.post('/google', googleAuth);
router.post('/verify', verifyGoogleToken);

export default router;
