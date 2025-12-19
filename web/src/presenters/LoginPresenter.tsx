import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from "../views/LoginView";
import { signInWithGoogle, signOutUser, getCurrentUser } from '../services/googleAuth';

export function LoginPresenter() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await getCurrentUser();
            if (userData && userData.user) {
                setUser(userData.user);
            }
        } catch (err) {
            console.error('Auth check error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            const userData = await signInWithGoogle();
            setUser(userData.user);
            console.log('Sign in successful:', userData);
        } catch (err: any) {
            setError(err.message || 'Sign in failed');
            console.error('Sign in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOutUser();
            setUser(null);
            console.log('Signed out');
        } catch (err: any) {
            setError(err.message || 'Sign out failed');
        }
    };

    const handleGuestLogin = () => {
        navigate('/travel');
    };

    return (
        <LoginView
            user={user}
            error={error}
            loading={loading}
            onGoogleSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
            onGuestLogin={handleGuestLogin}
        />
    );
}
