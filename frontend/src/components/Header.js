import React from 'react';
import {Link} from 'react-router-dom';
import LineChart from "../assets/images/LineChart";

const Header = React.memo(() => {
    return (
        <div className="absolute top-6 left-6">
            <Link to='/' className="inline-block">
                <div className="w-16 h-16 bg-gray-600 hover:bg-green-600 rounded-full flex items-center justify-center">
                    <LineChart size={32} color="#ffffff"/>
                </div>
            </Link>
        </div>
    )
});

export default Header;
