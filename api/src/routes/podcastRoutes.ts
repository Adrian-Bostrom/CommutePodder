import { Router } from 'express';
import { searchPodcasts, getEpisode } from '../controllers/PodcastController.js';

const router = Router();

router.get('/', (req, res, next) => {
    if (req.query.id) {
        return getEpisode(req, res);
    }
    return searchPodcasts(req, res);
});

export default router;
