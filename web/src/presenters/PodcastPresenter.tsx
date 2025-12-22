import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PodcastView } from '../views/PodcastView';
import type { PodcastEpisode } from '../views/PodcastView';
import type { Genre } from '../model';

export const PodcastPresenter = () => {
    const location = useLocation();
    const duration = location.state?.duration || 30; // Default to 30 mins if no state
    
    const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch genres
    useEffect(() => {
        fetch('/api/podcasts/genres')
            .then(res => res.json())
            .then(data => {
                if (data && data.genres) {
                    setGenres(data.genres);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        let url = `/api/podcasts?duration=${duration}`;
        if (selectedGenre) {
            url += `&genre_ids=${selectedGenre}`;
        }

        fetch(url, { signal })
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
    }, [duration, selectedGenre]);

    return <PodcastView 
        podcasts={podcasts} 
        loading={loading} 
        error={error} 
        targetDuration={duration}
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
    />;
};
