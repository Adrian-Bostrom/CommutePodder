import { useEffect, useState } from 'react';
import { TravelInfoView } from '../views/TravelInfoView';

export const TravelInfoPresenter = () => {
    const [travelData, setTravelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/travel')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch travel info');
                return response.json();
            })
            .then(data => {
                setTravelData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return <TravelInfoView travelData={travelData} loading={loading} error={error} />;
};
