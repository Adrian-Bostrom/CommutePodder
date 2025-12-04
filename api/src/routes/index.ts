import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/health', healthRoutes);

// Add more route modules here
// router.use('/users', userRoutes);
// router.use('/podcasts', podcastRoutes);

export default router;
