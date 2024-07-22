import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import defaultProfilePic from '../assets/images/default-profile-pic.svg';
import logo from "../assets/images/logo.svg";
import axios from "axios";

const UserHeader = ({user}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
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

        // Add event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <div className="absolute top-6 left-6">
                <a href='/dashboard' className="inline-block">
                    <img src={logo} className="w-16" alt="ProgressPal logo"/>
                </a>
            </div>
            <div className="absolute top-6 right-6" ref={dropdownRef}>
                <img
                    src={defaultProfilePic}
                    className="w-10 h-10 rounded-full cursor-pointer hover:rounded-lg transition-all duration-300"
                    alt="User profile"
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHeader;
