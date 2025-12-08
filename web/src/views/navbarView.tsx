import { Link } from "react-router-dom";

export function NavbarView() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                            CommutePodder
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link to="/travel" className="text-gray-600 hover:text-gray-900">
                            Travel
                        </Link>
                        <Link to="/episodes" className="text-gray-600 hover:text-gray-900">
                            Episodes
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                            Profile
                        </Link>
                    </div>
                    
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => console.log("Clicked Menu")}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
