import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const HamburgerMenu = ({ item, onEdit, onDelete, type }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleClick = (event) => {
        event.stopPropagation();
        setIsOpen(prev => !prev);
    };

    const handleEditClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (onDelete) {
            onDelete(item.id);
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-30">
            <button
                onClick={handleClick}
                ref={buttonRef}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full focus:outline-none transition-transform transform duration-300 ease-in-out"
                aria-label={`Toggle ${type} menu`}
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 bg-gray-900 text-white rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out"
                    role="menu"
                    aria-orientation="vertical"
                >
                    {type !== 'goal' && onEdit && (
                        <button
                            onClick={handleEditClick}
                            className="block px-4 py-2 rounded-t-lg hover:bg-blue-600 bg-blue-500 w-full text-left transition-colors duration-300"
                            role="menuitem"
                            aria-label={`Edit ${type}`}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={handleDeleteClick}
                        className={`block px-4 py-2 ${type !== 'goal' ? 'rounded-b-lg' : 'rounded-lg'} hover:bg-red-600 bg-red-500 w-full text-left transition-colors duration-300`}
                        role="menuitem"
                        aria-label={`Delete ${type}`}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

HamburgerMenu.propTypes = {
    item: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
};

export default HamburgerMenu;
