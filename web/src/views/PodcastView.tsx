import { Link } from 'react-router-dom';
import type { Genre } from '../model';

export interface PodcastEpisode {
    id: string;
    title_original: string;
    description_original: string;
    audio: string;
    image: string;
    audio_length_sec: number;
    podcast: {
        title_original: string;
        publisher_original: string;
    };
}

interface PodcastViewProps {
    podcasts: PodcastEpisode[];
    loading: boolean;
    error: string | null;
    targetDuration: number;
    genres: Genre[];
    selectedGenre: string;
    onSelectGenre: (id: string) => void;
}

export const PodcastView = ({ 
    podcasts, 
    loading, 
    error, 
    targetDuration,
    genres,
    selectedGenre,
    onSelectGenre
}: PodcastViewProps) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Recommended Podcasts</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                <p className="text-gray-600">
                    Finding episodes around {targetDuration} minutes for your trip.
                </p>
                
                <div className="flex items-center gap-2">
                    <label htmlFor="genre-select" className="font-medium text-gray-700">Category:</label>
                    <select
                        id="genre-select"
                        value={selectedGenre}
                        onChange={(e) => onSelectGenre(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <div className="p-4">Loading podcasts...</div>}
            {error && <div className="p-4 text-red-500">Error: {error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {podcasts.map((episode) => (
                        <div key={episode.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                            <Link to={`/podcast/${episode.id}`}>
                                <img 
                                    src={episode.image} 
                                    alt={episode.title_original} 
                                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                                />
                            </Link>
                            <div className="p-4 flex-1 flex flex-col">
                                <Link to={`/podcast/${episode.id}`} className="hover:text-blue-600">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{episode.title_original}</h3>
                                </Link>
                                <p className="text-sm text-gray-600 mb-2">{episode.podcast.title_original}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                                        {Math.round(episode.audio_length_sec / 60)} min
                                    </span>
                                    <a 
                                        href={episode.audio} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                    >
                                        Listen
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && !error && podcasts.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                    No podcasts found matching your criteria.
                </div>
            )}
        </div>
    );
};

