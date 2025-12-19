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

    const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [searchTime, setSearchTime] = useState(() => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    });

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

    const handleSearch = () => {
        if (selectedFrom && selectedTo) {
            setLoading(true);
            fetch(`/api/travel?originId=${selectedFrom.id}&destId=${selectedTo.id}&date=${searchDate}&time=${searchTime}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch travel info');
                    return response.json();
                })
                .then(data => {
                    console.log("Received travel data:", data);
                    if (data && data.journeys) {
                        const mappedData = data.journeys.map((journey: any, index: number) => {
                            const legs = journey.legs.map((leg: any) => {
                                let timeDisplay = 'Unknown';
                                if (leg.origin && leg.origin.departureTimePlanned) {
                                    const date = new Date(leg.origin.departureTimePlanned);
                                    timeDisplay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                }
                                return {
                                    line: leg.transportation?.disassembledName || leg.transportation?.name || 'Walk',
                                    destination: leg.destination?.name || 'Unknown',
                                    direction: leg.transportation?.destination?.name,
                                    time: timeDisplay,
                                    type: leg.transportation?.product?.name || 'Walk',
                                    origin: leg.origin?.name || 'Unknown'
                                };
                            });

                            // Calculate total duration or start/end time
                            const firstLeg = journey.legs[0];
                            const lastLeg = journey.legs[journey.legs.length - 1];
                            
                            const startTime = firstLeg.origin?.departureTimePlanned 
                                ? new Date(firstLeg.origin.departureTimePlanned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'Unknown';
                                
                            const endTime = lastLeg.destination?.arrivalTimePlanned
                                ? new Date(lastLeg.destination.arrivalTimePlanned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'Unknown';

                            // Simple duration calculation if needed, or just show start-end
                            let duration = 'Unknown';
                            if (firstLeg.origin?.departureTimePlanned && lastLeg.destination?.arrivalTimePlanned) {
                                const start = new Date(firstLeg.origin.departureTimePlanned).getTime();
                                const end = new Date(lastLeg.destination.arrivalTimePlanned).getTime();
                                const diffMins = Math.round((end - start) / 60000);
                                duration = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
                            }

                            return {
                                id: index,
                                startTime,
                                endTime,
                                duration,
                                legs
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
    };

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
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        searchTime={searchTime}
        setSearchTime={setSearchTime}
        onSearch={handleSearch}
    />;
};
