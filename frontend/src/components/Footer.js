import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <footer className="bg-gray-800 py-4 fixed bottom-0 inset-x-0 shadow-lg">
            <div className="flex justify-around md:justify-center items-center space-x-6 md:space-x-16">
                <Link to="/goals" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 md:w-12 md:h-12 ${isActive('/goals') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                    </button>
                    <span className={`text-xs md:text-sm ${isActive('/goals') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Goals</span>
                </Link>
                <Link to="/dashboard" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 md:w-12 md:h-12 ${isActive('/dashboard') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <span className={`text-xs md:text-sm ${isActive('/dashboard') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Dashboard</span>
                </Link>
                <Link to="/routines" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 md:w-12 md:h-12 ${isActive('/routines') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                    </button>
                    <span className={`text-xs md:text-sm ${isActive('/routines') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Routines</span>
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
