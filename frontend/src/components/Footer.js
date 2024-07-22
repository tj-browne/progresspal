import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#2C2C2C] py-2">
            <div className="flex justify-center items-center space-x-16">
                <a href="/goals" className="flex flex-col items-center">
                    <button
                        className="w-10 h-10 bg-[#7E7F81] text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1">
                    </button>
                    <span className="text-xs text-[#7E7F81] font-semibold flex items-end">Goals</span>
                </a>
                <a href="/dashboard" className="flex flex-col items-center">
                    <button
                        className="w-10 h-10 bg-white text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1">
                    </button>
                    <span className="text-xs text-white font-semibold flex items-end">Dashboard</span>
                </a>
                <a href="/routines" className="flex flex-col items-center">
                    <button
                        className="w-10 h-10 bg-[#7E7F81] text-[#2C2C2C] rounded-full flex items-center justify-center shadow-md hover:bg-[#6D6E70] transition duration-300 mb-1">
                    </button>
                    <span className="text-xs text-[#7E7F81] font-semibold flex items-end">Routines</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
