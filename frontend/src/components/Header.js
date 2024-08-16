import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/images/logo.svg";

const Header = React.memo(() => {
    return (
        <div className="absolute top-6 left-6">
            <Link to='/' className="inline-block">
                <img src={logo} className="w-16" alt="ProgressPal logo" />
            </Link>
        </div>
    )
});

export default Header;
