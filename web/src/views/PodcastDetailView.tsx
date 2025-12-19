import React from 'react';

export interface PodcastEpisodeDetail {
  id: string;
  title: string;
  description: string;
  audio: string;
  image: string;
  thumbnail: string;
  pub_date_ms: number;
  listennotes_url: string;
  podcast: {
    id: string;
    title: string;
    publisher: string;
    image: string;
    thumbnail: string;
  };
}

interface PodcastDetailViewProps {
  episode: PodcastEpisodeDetail | null;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PodcastDetailView: React.FC<PodcastDetailViewProps> = ({ episode, loading, error, isFavorite, onToggleFavorite }) => {
  if (loading) return <div className="p-4 text-center">Loading episode details...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  if (!episode) return <div className="p-4 text-center">Episode not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:w-64" src={episode.image} alt={episode.title} />
          </div>
          <div className="p-8 flex flex-col justify-between w-full">
            <div>
                <div className="flex justify-between items-start">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{episode.podcast.title}</div>
                    <button 
                        onClick={onToggleFavorite}
                        className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50 hover:text-red-500'}`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <h1 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">{episode.title}</h1>
                <p className="mt-2 text-gray-500 text-sm">Published: {new Date(episode.pub_date_ms).toLocaleDateString()}</p>
                <div className="mt-4 text-gray-600 prose max-w-none" dangerouslySetInnerHTML={{ __html: episode.description }} />
            </div>
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Listen Now</h3>
                <audio controls className="w-full">
                    <source src={episode.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            
            <div className="mt-4 text-right">
                <a href={episode.listennotes_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 text-sm">
                    View on Listen Notes &rarr;
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
