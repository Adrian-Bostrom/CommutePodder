import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import travelRoutes from './travelRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/travel', travelRoutes);

// Add more route modules here
// router.use('/users', userRoutes);
// router.use('/podcasts', podcastRoutes);

export default router;
