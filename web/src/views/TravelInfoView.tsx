export interface Leg {
    line: string;
    destination: string;
    direction?: string;
    time: string;
    type: string;
    origin: string;
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
}

export const TravelInfoView = ({ 
    travelData, loading, error,
    fromSearch, setFromSearch, fromResults, onSelectFrom,
    toSearch, setToSearch, toResults, onSelectTo,
    searchDate, setSearchDate, searchTime, setSearchTime, onSearch,
    onSelectTrip
}: TravelInfoViewProps) => {
    // if (loading) return <div className="p-4">Loading travel info...</div>; // Move loading inside to allow search while loading? Or just keep it simple.
    // If I return early, I can't see the search bar if it's loading initial data.
    // I'll remove the early return for loading/error and render them conditionally below the search bar.

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">SL Travel Information</h2>
            
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
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        onClick={onSearch}
                    >
                        Search Trips
                    </button>
                </div>
            </div>

            {loading && <div className="p-4">Loading travel info...</div>}
            {error && <div className="p-4 text-red-500">Error: {error}</div>}

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
                                <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                                    <div className="w-16 text-sm font-bold text-gray-600">
                                        {leg.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">
                                            {leg.type} {leg.line !== 'Unknown' && leg.line}
                                            {leg.direction && <span className="text-gray-500 font-normal text-sm ml-1">towards {leg.direction}</span>}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            From {leg.origin} to {leg.destination}
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
