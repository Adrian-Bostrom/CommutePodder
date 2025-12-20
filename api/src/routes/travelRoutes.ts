import { Router } from 'express';
import { getTravelInfo } from '../controllers/travelController.js';
import { optionalAuthenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateJWT, getTravelInfo);

export default router;
