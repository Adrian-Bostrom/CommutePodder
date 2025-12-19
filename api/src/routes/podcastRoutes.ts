import { Router } from 'express';
import { searchPodcasts } from '../controllers/PodcastController.js';

const router = Router();

router.get('/', searchPodcasts);

export default router;
