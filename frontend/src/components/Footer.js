import React from 'react';
import {useLocation} from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <footer className="bg-[#2C2C2C] py-2 fixed bottom-0 inset-x-0">
            <div className="flex justify-center items-center space-x-16">
                <a href="/goals" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 ${isActive('/goals') ? 'bg-white' : 'bg-[#7E7F81]'} text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1`}
                    ></button>
                    <span
                        className={`text-xs ${isActive('/goals') ? 'text-white' : 'text-[#7E7F81]'} font-semibold flex items-end`}>Goals</span>
                </a>
                <a href="/dashboard" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 ${isActive('/dashboard') ? 'bg-white' : 'bg-[#7E7F81]'} text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1`}
                    ></button>
                    <span
                        className={`text-xs ${isActive('/dashboard') ? 'text-white' : 'text-[#7E7F81]'} font-semibold flex items-end`}>Dashboard</span>
                </a>
                <a href="/routines" className="flex flex-col items-center">
                    <button
                        className={`w-10 h-10 ${isActive('/routines') ? 'bg-white' : 'bg-[#7E7F81]'} text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1`}
                    ></button>
                    <span
                        className={`text-xs ${isActive('/routines') ? 'text-white' : 'text-[#7E7F81]'} font-semibold flex items-end text-center`}>Routines</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
