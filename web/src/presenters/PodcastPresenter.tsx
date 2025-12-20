import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PodcastView } from '../views/PodcastView';
import type { PodcastEpisode } from '../views/PodcastView';

export const PodcastPresenter = () => {
    const location = useLocation();
    const duration = location.state?.duration || 30; // Default to 30 mins if no state
    
    const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        fetch(`/api/podcasts?duration=${duration}`, { signal })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch podcasts');
                return res.json();
            })
            .then(data => {
                if (data && data.results) {
                    setPodcasts(data.results);
                } else {
                    setPodcasts([]);
                }
                setLoading(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error(err);
                setError(err.message);
                setLoading(false);
            });

        return () => controller.abort();
    }, [duration]);

    return <PodcastView 
        podcasts={podcasts} 
        loading={loading} 
        error={error} 
        targetDuration={duration}
    />;
};
