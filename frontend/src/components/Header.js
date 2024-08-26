import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from "../assets/images/LineChart";

const Header = React.memo(() => {
    return (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <Link to='/' className="inline-block">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-600 hover:bg-green-600 rounded-full flex items-center justify-center">
                    <LineChart size={32} color="#ffffff" className="md:w-10 md:h-10"/>
                </div>
            </Link>
        </div>
    )
});

export default Header;
