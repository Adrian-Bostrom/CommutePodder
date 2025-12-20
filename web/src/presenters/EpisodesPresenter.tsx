import { useEffect, useState } from 'react';
import { EpisodesView } from '../views/EpisodesView';
import type { PodcastEpisodeDetail } from '../views/PodcastDetailView';

export const EpisodesPresenter = () => {
    const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisodeDetail | null>(null);
    const [likedEpisodes, setLikedEpisodes] = useState<PodcastEpisodeDetail[]>([]);
    const [recommendedEpisodes, setRecommendedEpisodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch User
                const userRes = await fetch('/api/users/me', { signal });
                if (!userRes.ok) throw new Error('Failed to fetch user profile');
                const user = await userRes.json();

                const promises = [];

                // 2. Fetch Current Pod
                if (user.currentPod) {
                    promises.push(
                        fetch(`/api/podcasts?id=${user.currentPod}`, { signal })
                            .then(res => res.ok ? res.json() : null)
                            .then(data => setCurrentEpisode(data))
                            .catch(err => console.error("Failed to fetch current pod", err))
                    );
                }

                // 3. Fetch Liked Pods (limit to last 3 for now to save API calls)
                if (user.favouritePods && user.favouritePods.length > 0) {
                    // Reverse to get most recent likes first
                    const recentLikes = [...user.favouritePods].reverse().slice(0, 3);
                    
                    const likePromises = recentLikes.map((id: string) => 
                        fetch(`/api/podcasts?id=${id}`, { signal })
                            .then(res => res.ok ? res.json() : null)
                    );

                    promises.push(
                        Promise.all(likePromises)
                            .then(results => setLikedEpisodes(results.filter(Boolean)))
                            .catch(err => console.error("Failed to fetch liked pods", err))
                    );
                }

                // 4. Fetch Recommendations (Generic search for now)
                promises.push(
                    fetch(`/api/podcasts?q=news&duration=30`, { signal })
                        .then(res => res.ok ? res.json() : null)
                        .then(data => {
                            if (data && data.results) {
                                setRecommendedEpisodes(data.results.slice(0, 4));
                            }
                        })
                        .catch(err => console.error("Failed to fetch recommendations", err))
                );

                await Promise.all(promises);

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
    }, []);

    return <EpisodesView 
        currentEpisode={currentEpisode}
        likedEpisodes={likedEpisodes}
        recommendedEpisodes={recommendedEpisodes}
        loading={loading}
        error={error}
    />;
};
