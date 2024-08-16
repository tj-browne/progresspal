import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import defaultProfilePic from '../assets/images/default-profile-pic.svg';
import logo from "../assets/images/logo.svg";
import axios from "axios";
import { getCsrfToken } from "../services/csrfService";

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
    const profileImgClass = isDropdownOpen || isProfilePath ? 'brightness-200' : 'brightness-100';

    return (
        <div className="relative">
            <div className="absolute top-6 left-6 p-2">
                <a href='/dashboard' className="inline-block">
                    <img
                        src={logo}
                        className="w-16 filter brightness-100 hue-rotate-180"
                        alt="ProgressPal logo"
                    />
                </a>
            </div>
            <div className="absolute top-6 right-6" ref={dropdownRef}>
                <img
                    src={defaultProfilePic}
                    className={`w-12 h-12 rounded-full cursor-pointer hover:rounded-lg transition-all duration-300 ${profileImgClass} filter brightness-100 hue-rotate-180`}
                    alt="User profile"
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white shadow-lg rounded-lg">
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
