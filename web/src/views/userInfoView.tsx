import { User } from '../model.ts';

interface UserViewProps {
    user: User | null;
    loading: boolean;
    error: string | null;
    onAddFavouritePod?:  (podId: string) => void;
    onRemoveFavouritePod?:  (podId: string) => void;
    onToggleReady?: () => void;
    onSetCurrentPod?:  (podId: string) => void;
}

export const UserView = ({ 
    user, 
    loading, 
    error,
    onAddFavouritePod,
    onRemoveFavouritePod,
    onToggleReady,
    onSetCurrentPod
}: UserViewProps) => {
    if (loading) return <div className="p-4">Loading user info...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!user) return <div className="p-4">No user data available</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Profile</h2>
                {onToggleReady && (
                    <button
                        onClick={onToggleReady}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            user. ready 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                        }`}
                    >
                        {user.ready ? '✓ Ready' : 'Not Ready'}
                    </button>
                )}
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* User ID & Status */}
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                        <span className="text-sm font-semibold text-gray-600 uppercase block mb-1">User ID</span>
                        <p className="text-lg text-gray-900">{user. uid}</p>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-600 uppercase block mb-1">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            user. ready ?  'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {user.ready ? 'Ready' :  'Not Ready'}
                        </span>
                    </div>
                </div>

                {/* Current Pod */}
                <div className="border-b pb-4">
                    <span className="text-sm font-semibold text-gray-600 uppercase block mb-2">Current Pod</span>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-lg font-bold">
                            {user.currentPod ? `Pod ${user.currentPod}` : 'No Pod Selected'}
                        </span>
                        {onSetCurrentPod && (
                            <input
                                type="text"
                                placeholder="Change pod ID..."
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const value = (e.target as HTMLInputElement).value;
                                        if (value) {
                                            onSetCurrentPod(value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Favourite Pods */}
                <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600 uppercase">
                            Favourite Pods ({user.favouritePods.length})
                        </span>
                        {onAddFavouritePod && (
                            <input
                                type="number"
                                placeholder="Add pod..."
                                className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const value = parseInt((e.target as HTMLInputElement).value);
                                        if (!isNaN(value)) {
                                            onAddFavouritePod(value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {user.favouritePods.length > 0 ? (
                            user.favouritePods. map((podId) => (
                                <div key={podId} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    <span>Pod {podId}</span>
                                    {onRemoveFavouritePod && (
                                        <button
                                            onClick={() => onRemoveFavouritePod(podId)}
                                            className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No favourite pods</span>
                        )}
                    </div>
                </div>

                {/* Current Route */}
                <div className="border-b pb-4">
                    <span className="text-sm font-semibold text-gray-600 uppercase block mb-2">Current Route</span>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Start</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {user.currentRoute.startId}
                                </div>
                            </div>
                            <div className="text-3xl text-gray-400">→</div>
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">End</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {user.currentRoute.endId}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favourite Routes */}
                <div className="border-b pb-4">
                    <span className="text-sm font-semibold text-gray-600 uppercase block mb-2">
                        Favourite Routes ({user. favouriteRoutes.length})
                    </span>
                    {user.favouriteRoutes.length > 0 ? (
                        <div className="space-y-2">
                            {user.favouriteRoutes.map((route, index) => (
                                <div 
                                    key={index} 
                                    className={`p-3 rounded-lg flex items-center justify-between ${
                                        user.isFavouriteRoute(route. startId, route.endId)
                                            ? 'bg-purple-50 border border-purple-200'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{route.startId}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="font-bold text-gray-900">{route.endId}</span>
                                        </div>
                                    </div>
                                    <span className="text-purple-600 text-xs">★ Favourite</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-500 text-sm">No favourite routes</span>
                    )}
                </div>

                {/* Route History */}
                <div>
                    <span className="text-sm font-semibold text-gray-600 uppercase block mb-3">
                        Route History ({user.routeHistory.length})
                    </span>
                    {user.routeHistory.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Start ID
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Route
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            End ID
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.routeHistory.map((route, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span className="text-gray-600">{index + 1}</span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span className="text-gray-900 font-bold">{route.startId}</span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                <span className="text-gray-400">→</span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span className="text-gray-900 font-bold">{route.endId}</span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {user.isFavouriteRoute(route. startId, route.endId) && (
                                                    <span className="text-purple-500 text-xs">★</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <span className="text-gray-500 text-sm">No route history</span>
                    )}
                </div>
            </div>
        </div>
    );
};