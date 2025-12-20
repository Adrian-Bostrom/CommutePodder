import React from 'react';
import { Link } from 'react-router-dom';
import type { PodcastEpisodeDetail } from './PodcastDetailView';

interface EpisodesViewProps {
    currentEpisode: PodcastEpisodeDetail | null;
    likedEpisodes: PodcastEpisodeDetail[];
    recommendedEpisodes: any[]; // Using any for now as search results have slightly different shape than details
    loading: boolean;
    error: string | null;
}

export const EpisodesView: React.FC<EpisodesViewProps> = ({ 
    currentEpisode, 
    likedEpisodes, 
    recommendedEpisodes, 
    loading, 
    error 
}) => {
    if (loading && !currentEpisode && likedEpisodes.length === 0) {
        return <div className="p-8 text-center">Loading your episodes...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-12">
            
            {/* Currently Listening Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-green-500">●</span> Currently Listening
                </h2>
                {currentEpisode ? (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl overflow-hidden text-white">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <img 
                                    className="h-48 w-full object-cover md:w-48" 
                                    src={currentEpisode.image} 
                                    alt={currentEpisode.title} 
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-center flex-1">
                                <div className="uppercase tracking-wide text-sm text-indigo-100 font-semibold">
                                    {currentEpisode.podcast.title}
                                </div>
                                <Link to={`/podcast/${currentEpisode.id}`} className="block mt-1 text-xl leading-tight font-bold text-white hover:underline">
                                    {currentEpisode.title}
                                </Link>
                                <div className="mt-4">
                                    <audio controls className="w-full h-8 opacity-90" src={currentEpisode.audio}>
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500">
                        You haven't selected a podcast for your commute yet.
                        <br />
                        <Link to="/travel" className="text-indigo-600 hover:underline mt-2 inline-block">
                            Plan a trip to find one!
                        </Link>
                    </div>
                )}
            </section>

            {/* Liked Episodes Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Liked Episodes</h2>
                {likedEpisodes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {likedEpisodes.map(episode => (
                            <div key={episode.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex h-32">
                                    <img 
                                        src={episode.thumbnail} 
                                        alt={episode.title} 
                                        className="w-32 h-32 object-cover"
                                    />
                                    <div className="p-3 flex-1 overflow-hidden">
                                        <h3 className="font-bold text-sm line-clamp-2 mb-1">
                                            <Link to={`/podcast/${episode.id}`} className="hover:text-indigo-600">
                                                {episode.title}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-1">{episode.podcast.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No liked episodes yet.</p>
                )}
            </section>

            {/* Recommended Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedEpisodes.map(episode => (
                        <div key={episode.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <Link to={`/podcast/${episode.id}`}>
                                <img 
                                    src={episode.image} 
                                    alt={episode.title_original} 
                                    className="w-full h-40 object-cover"
                                />
                            </Link>
                            <div className="p-3">
                                <h3 className="font-bold text-sm line-clamp-2 mb-1">
                                    <Link to={`/podcast/${episode.id}`} className="hover:text-indigo-600">
                                        {episode.title_original}
                                    </Link>
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
