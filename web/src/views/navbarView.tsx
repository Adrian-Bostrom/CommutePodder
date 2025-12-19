import { Link } from "react-router-dom";

interface NavbarViewProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

export function NavbarView({ isMenuOpen, toggleMenu }: NavbarViewProps) {
    return (
        <nav className="bg-white shadow-md relative z-50">
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
                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={toggleMenu}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link to="/travel" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>
                            Travel
                        </Link>
                        <Link to="/episodes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>
                            Episodes
                        </Link>
                        <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={toggleMenu}>
                            Profile
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
