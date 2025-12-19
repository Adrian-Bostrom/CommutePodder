import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import travelRoutes from './travelRoutes.js';
import stopRoutes from './stopRoutes.js';
import userRoutes from './usersRoute.js';
import authRoutes from './authRoutes.js';
import podcastRoutes from './podcastRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/travel', travelRoutes);
router.use('/stops', stopRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/podcasts', podcastRoutes);

export default router;
