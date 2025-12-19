import { useState } from 'react';
import { signInWithGoogle, signOutUser } from '../services/googleAuth';

export default function AuthTest() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
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
    <div style={{ padding: '20px' }}>
      <h2>Google Auth Test</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {!user ? (
        <button 
          onClick={handleSignIn} 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      ) : (
        <div>
          <p>Signed in as: {user.email}</p>
          <p>Name: {user.name}</p>
          <p>UID: {user.uid}</p>
          {user.picture && <img src={user.picture} alt="Profile" style={{ width: '50px', borderRadius: '50%' }} />}
          <br />
          <button 
            onClick={handleSignOut}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
