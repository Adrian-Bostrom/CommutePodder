import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PodcastDetailView } from '../views/PodcastDetailView';
import type { PodcastEpisodeDetail } from '../views/PodcastDetailView';

export const PodcastDetailPresenter = () => {
    const { id } = useParams<{ id: string }>();
    const [episode, setEpisode] = useState<PodcastEpisodeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCurrentPod, setIsCurrentPod] = useState(false);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        const signal = controller.signal;

        setLoading(true);
        
        const fetchData = async () => {
            try {
                const [episodeRes, userRes] = await Promise.all([
                    fetch(`/api/podcasts?id=${id}`, { signal }),
                    fetch('/api/users/me', { signal })
                ]);

                if (!episodeRes.ok) throw new Error('Failed to fetch episode details');
                const episodeData = await episodeRes.json();
                setEpisode(episodeData);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData) {
                        if (userData.favouritePods) {
                            setIsFavorite(userData.favouritePods.includes(id));
                        }
                        if (userData.currentPod) {
                            setIsCurrentPod(String(userData.currentPod) === String(id));
                        }
                    }
                }
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error(err);
                setError(err.message);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [id]);

    const handleSelectPod = async () => {
        if (!id) return;

        try {
            const res = await fetch('/api/users/current-pod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ podcastId: id })
            });

            if (res.status === 401) {
                alert("Please login to select a podcast");
                return;
            }

            const data = await res.json();
            if (data.success) {
                setIsCurrentPod(true);
            }
        } catch (err) {
            console.error("Failed to select podcast", err);
        }
    };

    const handleToggleFavorite = async () => {
        if (!id) return;
        
        try {
            const res = await fetch('/api/users/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ podcastId: id })
            });
            
            if (res.status === 401) {
                // Ideally redirect to login or show a modal
                alert("Please login to favorite episodes");
                return;
            }
            
            const data = await res.json();
            if (data.success) {
                setIsFavorite(data.isFavorite);
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    return <PodcastDetailView 
        episode={episode} 
        loading={loading} 
        error={error} 
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onSelectPod={handleSelectPod}
        isCurrentPod={isCurrentPod}
    />;
};
