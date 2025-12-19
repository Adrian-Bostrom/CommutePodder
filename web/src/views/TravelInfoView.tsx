export interface TravelInfo {
    id: number;
    line: string;
    destination: string;
    time: string;
    type: string;
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
}

export const TravelInfoView = ({ 
    travelData, loading, error,
    fromSearch, setFromSearch, fromResults, onSelectFrom,
    toSearch, setToSearch, toResults, onSelectTo
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

            {loading && <div className="p-4">Loading travel info...</div>}
            {error && <div className="p-4 text-red-500">Error: {error}</div>}

            {!loading && !error && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Line
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Destination
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {travelData.map((item) => (
                            <tr key={item.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="text-gray-900 whitespace-no-wrap">{item.type}</span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="text-gray-900 whitespace-no-wrap font-bold">{item.line}</span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="text-gray-900 whitespace-no-wrap">{item.destination}</span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="text-gray-900 whitespace-no-wrap">{item.time}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
};
