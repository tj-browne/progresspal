import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const HamburgerMenu = ({ routineId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleClick = (event) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleEditClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onEdit();
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onDelete();
    };

    return (
        <div className="relative z-30">
            <button
                onClick={handleClick}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full focus:outline-none transition-transform transform duration-300 ease-in-out"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 bg-gray-900 text-white rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <button
                        onClick={handleEditClick}
                        className="block px-4 py-2 rounded-t-lg hover:bg-blue-600 bg-blue-500 w-full text-left transition-colors duration-300"
                        role="menuitem"
                        aria-label="Edit routine"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="block px-4 py-2 rounded-b-lg hover:bg-red-600 bg-red-500 w-full text-left transition-colors duration-300"
                        role="menuitem"
                        aria-label="Delete routine"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
