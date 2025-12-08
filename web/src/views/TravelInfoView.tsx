interface TravelInfo {
    id: number;
    line: string;
    destination: string;
    time: string;
    type: string;
}

interface TravelInfoViewProps {
    travelData: TravelInfo[];
    loading: boolean;
    error: string | null;
}

export const TravelInfoView = ({ travelData, loading, error }: TravelInfoViewProps) => {
    if (loading) return <div className="p-4">Loading travel info...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">SL Travel Information</h2>
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
        </div>
    );
};
