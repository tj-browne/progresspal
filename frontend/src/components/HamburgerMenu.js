import React, { useState } from 'react';

const HamburgerMenu = ({ onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 text-white focus:outline-none"
                aria-label="Open menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 bg-gray-800 text-white mt-2 rounded-lg shadow-lg">
                    <button
                        onClick={onDelete}
                        className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
