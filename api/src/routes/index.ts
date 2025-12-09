import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import travelRoutes from './travelRoutes.js';
import userRoutes from './usersRoute.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/travel', travelRoutes);
router.use('/users', userRoutes);

// Add more route modules here
// router.use('/podcasts', podcastRoutes);

export default router;
