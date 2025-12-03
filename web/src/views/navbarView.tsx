export function NavbarView() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            CommutePodder
                        </h1>
                    </div>
                    
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            Home
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            Episodes
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            Profile
                        </a>
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
