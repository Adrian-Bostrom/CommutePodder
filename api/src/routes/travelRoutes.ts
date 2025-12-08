import { Router } from 'express';
import { getTravelInfo } from '../controllers/travelController.js';

const router = Router();

router.get('/', getTravelInfo);

export default router;
