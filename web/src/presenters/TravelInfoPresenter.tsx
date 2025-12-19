import { useEffect, useState } from 'react';
import { TravelInfoView } from '../views/TravelInfoView';
import type { TravelInfo, Stop } from '../views/TravelInfoView';

export const TravelInfoPresenter = () => {
    const [travelData, setTravelData] = useState<TravelInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [fromResults, setFromResults] = useState<Stop[]>([]);
    const [toResults, setToResults] = useState<Stop[]>([]);
    const [selectedFrom, setSelectedFrom] = useState<Stop | null>(null);
    const [selectedTo, setSelectedTo] = useState<Stop | null>(null);

    // Search stops for Origin
    useEffect(() => {
        const timer = setTimeout(() => {
            if (fromSearch.length > 2 && !selectedFrom) {
                fetch(`/api/stops?q=${fromSearch}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.locations) {
                            const stops = data.locations.map((s: any) => ({
                                id: s.id,
                                name: s.name
                            }));
                            setFromResults(stops);
                        }
                    })
                    .catch(console.error);
            } else {
                setFromResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [fromSearch, selectedFrom]);

    // Search stops for Destination
    useEffect(() => {
        const timer = setTimeout(() => {
            if (toSearch.length > 2 && !selectedTo) {
                fetch(`/api/stops?q=${toSearch}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.locations) {
                            const stops = data.locations.map((s: any) => ({
                                id: s.id,
                                name: s.name
                            }));
                            setToResults(stops);
                        }
                    })
                    .catch(console.error);
            } else {
                setToResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [toSearch, selectedTo]);

    // Fetch trips when both selected
    useEffect(() => {
        if (selectedFrom && selectedTo) {
            setLoading(true);
            fetch(`/api/travel?originId=${selectedFrom.id}&destId=${selectedTo.id}`)
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
        }
    }, [selectedFrom, selectedTo]);

    const handleSelectFrom = (stop: Stop) => {
        setSelectedFrom(stop);
        setFromSearch(stop.name);
        setFromResults([]);
    };

    const handleSelectTo = (stop: Stop) => {
        setSelectedTo(stop);
        setToSearch(stop.name);
        setToResults([]);
    };

    return <TravelInfoView 
        travelData={travelData} 
        loading={loading} 
        error={error}
        fromSearch={fromSearch}
        setFromSearch={(val) => { setFromSearch(val); setSelectedFrom(null); }}
        fromResults={fromResults}
        onSelectFrom={handleSelectFrom}
        toSearch={toSearch}
        setToSearch={(val) => { setToSearch(val); setSelectedTo(null); }}
        toResults={toResults}
        onSelectTo={handleSelectTo}
    />;
};
