interface LoginViewProps {
    user: any;
    error: string;
    loading: boolean;
    onGoogleSignIn: () => void;
    onSignOut: () => void;
    onGuestLogin: () => void;
}

export default function LoginView({ user, error, loading, onGoogleSignIn, onSignOut, onGuestLogin }: LoginViewProps) {
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Welcome!
                        </h2>
                        <div className="text-center space-y-4">
                            {user.picture && (
                                <img 
                                    src={user.picture} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full mx-auto"
                                />
                            )}
                            <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-500 text-sm"><strong>UID:</strong> {user.uid}</p>
                            <button
                                onClick={onSignOut}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Welcome Back
                    </h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    <button
                        onClick={onGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 mb-4"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-5 h-5"
                        />
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={onGuestLogin}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}