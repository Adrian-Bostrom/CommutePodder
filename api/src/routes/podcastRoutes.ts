import { Router } from 'express';
import { getPodcasts } from '../controllers/PodcastController';

const router = Router();

router.get('/', getPodcasts);

export default router;
