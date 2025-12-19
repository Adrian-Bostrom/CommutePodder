import { useState } from 'react';
import LoginView from "../views/LoginView";
import { signInWithGoogle, signOutUser } from '../services/googleAuth';

export function LoginPresenter() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

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

    return (
        <LoginView
            user={user}
            error={error}
            loading={loading}
            onGoogleSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
        />
    );
}
