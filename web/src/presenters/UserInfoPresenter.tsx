import { useState, useEffect } from 'react';
import { UserView } from '../views/userInfoView.tsx';
import { User } from '../model.ts';

export const UserInfoPresenter = () =>  {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users/me');
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Not authenticated');
                    }
                    throw new Error('Failed to fetch user data');
                }
                
                const userData = await response.json();
                
                if (userData) {
                    const userInstance = User.fromJSON(userData);
                    setUser(userInstance);
                } else {
                    setError('No user data available');
                }
                
            } catch (err:  any) {
                console.error('Error fetching user:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return <UserView user={user} loading={loading} error={error} />;
}

export default UserInfoPresenter;