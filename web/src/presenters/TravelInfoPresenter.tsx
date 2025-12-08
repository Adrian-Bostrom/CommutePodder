import { useEffect, useState } from 'react';
import { TravelInfoView } from '../views/TravelInfoView';
import type { TravelInfo } from '../views/TravelInfoView';

export const TravelInfoPresenter = () => {
    const [travelData, setTravelData] = useState<TravelInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/travel')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch travel info');
                return response.json();
            })
            .then(data => {
                console.log("Received travel data:", data);
                if (data && data.journeys) {
                    const mappedData = data.journeys.map((journey: any, index: number) => {
                        // Use the first leg of the journey
                        const leg = journey.legs[0];
                        
                        // Format time from ISO string
                        let timeDisplay = 'Unknown';
                        if (leg.origin && leg.origin.departureTimePlanned) {
                            const date = new Date(leg.origin.departureTimePlanned);
                            timeDisplay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }

                        return {
                            id: index,
                            line: leg.transportation?.disassembledName || leg.transportation?.name || 'Unknown',
                            destination: leg.transportation?.destination?.name || leg.destination?.name || 'Unknown',
                            time: timeDisplay,
                            type: leg.transportation?.product?.name || 'Transport'
                        };
                    });
                    setTravelData(mappedData);
                } else {
                    setTravelData([]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return <TravelInfoView travelData={travelData} loading={loading} error={error} />;
};
