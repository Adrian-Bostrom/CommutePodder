export interface Leg {
    line: string;
    destination: string;
    direction?: string;
    time: string;
    type: string;
    origin: string;
    waitTime?: string;
}

export interface TravelInfo {
    id: number;
    startTime: string;
    endTime: string;
    duration: string;
    legs: Leg[];
}

export interface Stop {
    id: string;
    name: string;
}

export interface RecentTrip {
    startId: string;
    endId: string;
    startName: string;
    endName: string;
}

interface TravelInfoViewProps {
    travelData: TravelInfo[];
    loading: boolean;
    error: string | null;
    
    fromSearch: string;
    setFromSearch: (val: string) => void;
    fromResults: Stop[];
    onSelectFrom: (stop: Stop) => void;
    
    toSearch: string;
    setToSearch: (val: string) => void;
    toResults: Stop[];
    onSelectTo: (stop: Stop) => void;

    searchDate: string;
    setSearchDate: (val: string) => void;
    searchTime: string;
    setSearchTime: (val: string) => void;
    onSearch: () => void;
    onSelectTrip: (trip: TravelInfo) => void;

    recentTrips: RecentTrip[];
    onSelectRecentTrip: (trip: RecentTrip) => void;

    favoriteRoutes?: RecentTrip[];
    onToggleFavorite?: () => void;
    isCurrentRouteFavorite?: boolean;
}

export const TravelInfoView = ({ 
    travelData, loading, error,
    fromSearch, setFromSearch, fromResults, onSelectFrom,
    toSearch, setToSearch, toResults, onSelectTo,
    searchDate, setSearchDate, searchTime, setSearchTime, onSearch,
    onSelectTrip, recentTrips, onSelectRecentTrip,
    favoriteRoutes = [], onToggleFavorite, isCurrentRouteFavorite = false
}: TravelInfoViewProps) => {
    
    const getLineColor = (type: string, line: string) => {
        const lineNumber = parseInt(line);
        const lowerType = type.toLowerCase();

        if (lowerType.includes('metro') || lowerType.includes('t-bana') || lowerType.includes('tunnelbana')) {
            if ([10, 11].includes(lineNumber)) return 'bg-blue-600 text-white'; // Blue line
            if ([13, 14].includes(lineNumber)) return 'bg-red-600 text-white'; // Red line
            if ([17, 18, 19].includes(lineNumber)) return 'bg-green-600 text-white'; // Green line
            return 'bg-blue-800 text-white'; // Fallback Metro
        }
        
        if (lowerType.includes('commuter') || lowerType.includes('pendeltåg') || lowerType.includes('train')) {
            return 'bg-pink-600 text-white';
        }

        if (lowerType.includes('tram') || lowerType.includes('spårvagn') || lowerType.includes('lokalbana')) {
            if (lineNumber === 7) return 'bg-gray-500 text-white';
            if (lineNumber === 12) return 'bg-gray-500 text-white'; // Nockebybanan
            if (lineNumber === 21) return 'bg-orange-600 text-white'; // Lidingöbanan
            if (lineNumber === 22) return 'bg-orange-600 text-white'; // Tvärbanan
            return 'bg-gray-500 text-white';
        }

        if (lowerType.includes('bus')) {
            // Blue buses (Stombussar) - usually 1-4, 6, and some 17x, 47x, 87x etc.
            // Simplified check for single digit 1-6 (except 5 which is usually red)
            if ([1, 2, 3, 4, 6].includes(lineNumber)) return 'bg-blue-700 text-white';
            // Check for 172, 173, etc if needed, but standard red is fine for default
            return 'bg-red-500 text-white';
        }

        if (lowerType.includes('ferry') || lowerType.includes('båt')) {
            return 'bg-blue-400 text-white';
        }

        return 'bg-gray-200 text-gray-700'; // Walk or other
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Plan Your Trip</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2">From</label>
                    <input 
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={fromSearch}
                        onChange={(e) => setFromSearch(e.target.value)}
                        placeholder="Search origin..."
                    />
                    {fromResults.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {fromResults.map(stop => (
                                <li 
                                    key={stop.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onSelectFrom(stop)}
                                >
                                    {stop.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2">To</label>
                    <input 
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={toSearch}
                        onChange={(e) => setToSearch(e.target.value)}
                        placeholder="Search destination..."
                    />
                    {toResults.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {toResults.map(stop => (
                                <li 
                                    key={stop.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onSelectTo(stop)}
                                >
                                    {stop.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                    <input 
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                    <input 
                        type="time"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchTime}
                        onChange={(e) => setSearchTime(e.target.value)}
                    />
                </div>
                <div>
                    <div className="flex gap-2">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                            onClick={onSearch}
                        >
                            Search Trips
                        </button>
                        {onToggleFavorite && (
                            <button
                                className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isCurrentRouteFavorite ? 'bg-yellow-400 hover:bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                                onClick={onToggleFavorite}
                                title={isCurrentRouteFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                ★
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading && <div className="p-4">Loading travel info...</div>}
            {error && <div className="p-4 text-red-500">Error: {error}</div>}

            {!loading && travelData.length === 0 && (
                <>
                    {favoriteRoutes && favoriteRoutes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Favorite Trips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {favoriteRoutes.map((trip, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-yellow-50 p-4 rounded-lg shadow hover:shadow-md cursor-pointer border border-yellow-200 transition-all hover:border-yellow-400"
                                        onClick={() => onSelectRecentTrip(trip)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{trip.startName}</div>
                                                <div className="text-gray-400 text-sm my-1">↓</div>
                                                <div className="font-medium text-gray-900">{trip.endName}</div>
                                            </div>
                                            <div className="text-yellow-500 text-xl">
                                                ★
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {recentTrips.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Recent Trips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentTrips.slice().reverse().slice(0, 4).map((trip, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer border border-gray-200 transition-all hover:border-blue-300"
                                        onClick={() => onSelectRecentTrip(trip)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{trip.startName}</div>
                                                <div className="text-gray-400 text-sm my-1">↓</div>
                                                <div className="font-medium text-gray-900">{trip.endName}</div>
                                            </div>
                                            <div className="text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!loading && !error && (
            <div className="space-y-4">
                {travelData.map((trip) => (
                    <div key={trip.id} className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <div>
                                <span className="text-lg font-bold">{trip.startTime}</span>
                                <span className="mx-2 text-gray-500">→</span>
                                <span className="text-lg font-bold">{trip.endTime}</span>
                            </div>
                            <div className="text-gray-600">
                                Duration: {trip.duration}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            {trip.legs.map((leg, idx) => (
                                <div key={idx}>
                                    {leg.waitTime && (
                                        <div className="pl-32 py-1 text-xs text-gray-500 flex items-center">
                                            <span className="mr-1">⏱</span>
                                            <span>{leg.waitTime} transfer</span>
                                        </div>
                                    )}
                                    <div className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                        <div className="w-28 text-sm font-bold text-gray-600 flex-shrink-0">
                                            {leg.time}
                                        </div>
                                        <div className="flex-1 flex items-center min-w-0">
                                            <div className={`flex-shrink-0 w-12 h-8 flex items-center justify-center rounded font-bold text-sm mr-3 ${getLineColor(leg.type, leg.line)}`}>
                                                {leg.type === 'Walk' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    leg.line
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">
                                                    {leg.type === 'Walk' ? 'Walk' : `To ${leg.destination}`}
                                                    {leg.direction && leg.type !== 'Walk' && <span className="text-gray-500 font-normal text-sm ml-1 hidden sm:inline">towards {leg.direction}</span>}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    From: {leg.origin}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <button 
                                onClick={() => onSelectTrip(trip)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Select Trip
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};
