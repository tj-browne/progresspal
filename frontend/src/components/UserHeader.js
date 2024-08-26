import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { getCsrfToken } from "../services/csrfService";
import LineChart from "../assets/images/LineChart";
import UserCircle from "../assets/images/UserCircle";

const UserHeader = ({ user }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleLogout = async () => {
        try {
            const csrfToken = await getCsrfToken();
            await axios.post('http://localhost:8000/api/auth/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            });
            localStorage.removeItem('authToken');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isProfilePath = location.pathname === '/profile';
    const profileIconClass = isDropdownOpen || isProfilePath ? 'brightness-200' : 'brightness-100';

    return (
        <div className="relative">
            <div className="absolute top-4 left-4 md:top-6 md:left-6 p-2 flex items-center">
                <Link to='/dashboard' className="inline-block">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-600 hover:bg-green-600 rounded-full flex items-center justify-center">
                        <LineChart size={24} color="#ffffff" className="md:w-8 md:h-8"/>
                    </div>
                </Link>
            </div>
            <div className="absolute top-4 right-4 md:top-6 md:right-6" ref={dropdownRef}>
                <div
                    className={`cursor-pointer hover:scale-110 transition-all duration-300 ${profileIconClass}`}
                    onClick={toggleDropdown}>
                    <UserCircle size={32} color="#ffffff" className="md:w-12 md:h-12"/>
                </div>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 md:w-56 bg-gray-800 text-white shadow-lg rounded-lg">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-300">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-300">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHeader;
