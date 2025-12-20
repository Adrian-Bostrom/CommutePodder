import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelInfoView } from '../views/TravelInfoView';
import type { TravelInfo, Stop, RecentTrip } from '../views/TravelInfoView';

export const TravelInfoPresenter = () => {
    const navigate = useNavigate();
    const [travelData, setTravelData] = useState<TravelInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
    const [favoriteRoutes, setFavoriteRoutes] = useState<RecentTrip[]>([]);

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

    // Fetch user data for recent trips
    useEffect(() => {
        fetch('/api/users/me')
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(user => {
                if (user) {
                    if (user.routeHistory) {
                        setRecentTrips(user.routeHistory);
                    }
                    if (user.favouriteRoutes) {
                        setFavoriteRoutes(user.favouriteRoutes);
                    }
                }
            })
            .catch(console.error);
    }, []);

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

    const performSearch = (originId: string, destId: string) => {
        setLoading(true);
        fetch(`/api/travel?originId=${originId}&destId=${destId}&date=${searchDate}&time=${searchTime}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch travel info');
                return response.json();
            })
            .then(data => {
                console.log("Received travel data:", data);
                if (data && data.journeys) {
                    const mappedData = data.journeys.map((journey: any, index: number) => {
                        const legs = journey.legs.map((leg: any, legIdx: number) => {
                            let startTime = 'Unknown';
                            let endTime = 'Unknown';

                            if (leg.origin && leg.origin.departureTimePlanned) {
                                const date = new Date(leg.origin.departureTimePlanned);
                                startTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }

                            if (leg.destination && leg.destination.arrivalTimePlanned) {
                                const date = new Date(leg.destination.arrivalTimePlanned);
                                endTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }

                            const timeDisplay = `${startTime} -> ${endTime}`;

                            let waitTime = undefined;
                            if (legIdx > 0) {
                                const prevLeg = journey.legs[legIdx - 1];
                                if (prevLeg.destination?.arrivalTimePlanned && leg.origin?.departureTimePlanned) {
                                    const arrival = new Date(prevLeg.destination.arrivalTimePlanned).getTime();
                                    const departure = new Date(leg.origin.departureTimePlanned).getTime();
                                    const diffMins = Math.round((departure - arrival) / 60000);
                                    if (diffMins > 0) {
                                        waitTime = `${diffMins} min`;
                                    }
                                }
                            }

                            return {
                                line: leg.transportation?.disassembledName || leg.transportation?.name || 'Walk',
                                destination: leg.destination?.name || 'Unknown',
                                direction: leg.transportation?.destination?.name,
                                time: timeDisplay,
                                type: leg.transportation?.product?.name || 'Walk',
                                origin: leg.origin?.name || 'Unknown',
                                waitTime
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
    };

    const handleSearch = () => {
        if (selectedFrom && selectedTo) {
            performSearch(selectedFrom.id, selectedTo.id);
        }
    };

    const handleSelectRecentTrip = (trip: RecentTrip) => {
        setSelectedFrom({ id: trip.startId, name: trip.startName });
        setFromSearch(trip.startName);
        setSelectedTo({ id: trip.endId, name: trip.endName });
        setToSearch(trip.endName);
        performSearch(trip.startId, trip.endId);
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

    const handleSelectTrip = (trip: TravelInfo) => {
        // Parse duration string "1h 30m" or "45m" to minutes
        let minutes = 0;
        const parts = trip.duration.split(' ');
        for (const part of parts) {
            if (part.endsWith('h')) {
                minutes += parseInt(part) * 60;
            } else if (part.endsWith('m')) {
                minutes += parseInt(part);
            }
        }
        
        navigate('/podcasts', { state: { duration: minutes } });
    };

    const handleToggleFavorite = async () => {
        if (!selectedFrom || !selectedTo) return;
        
        try {
            const res = await fetch('/api/users/favorites/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    startId: selectedFrom.id, 
                    endId: selectedTo.id,
                    startName: selectedFrom.name,
                    endName: selectedTo.name
                })
            });
            const data = await res.json();
            if (data.success) {
                setFavoriteRoutes(data.favoriteRoutes);
            }
        } catch (err) {
            console.error("Failed to toggle favorite route", err);
        }
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
        onSelectTrip={handleSelectTrip}
        recentTrips={recentTrips}
        onSelectRecentTrip={handleSelectRecentTrip}
        favoriteRoutes={favoriteRoutes}
        onToggleFavorite={handleToggleFavorite}
        isCurrentRouteFavorite={!!selectedFrom && !!selectedTo && favoriteRoutes.some(r => String(r.startId) === String(selectedFrom.id) && String(r.endId) === String(selectedTo.id))}
    />;
};
