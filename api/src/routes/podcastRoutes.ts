import { Router } from 'express';
import { searchPodcasts, getEpisode, getGenres } from '../controllers/PodcastController.js';
import { optionalAuthenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(optionalAuthenticateJWT);

router.get('/genres', getGenres);

router.get('/', (req, res, next) => {
    if (req.query.id) {
        return getEpisode(req, res);
    }
    return searchPodcasts(req, res);
});

export default router;
