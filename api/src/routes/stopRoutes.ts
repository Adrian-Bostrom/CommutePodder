import { Router } from 'express';
import { searchStops } from '../controllers/stopController.js';

const router = Router();

router.get('/', searchStops);

export default router;
