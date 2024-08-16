import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <footer className="bg-gray-800 py-2 fixed bottom-0 inset-x-0 shadow-lg">
            <div className="flex justify-center items-center space-x-16">
                <a href="/goals" className="flex flex-col items-center">
                    <button
                        className={`w-12 h-12 ${isActive('/goals') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                    </button>
                    <span className={`text-xs ${isActive('/goals') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Goals</span>
                </a>
                <a href="/dashboard" className="flex flex-col items-center">
                    <button
                        className={`w-12 h-12 ${isActive('/dashboard') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <span className={`text-xs ${isActive('/dashboard') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Dashboard</span>
                </a>
                <a href="/routines" className="flex flex-col items-center">
                    <button
                        className={`w-12 h-12 ${isActive('/routines') ? 'bg-green-500' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition duration-300 mb-1`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                    </button>
                    <span className={`text-xs ${isActive('/routines') ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-end`}>Routines</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
