import React from 'react';
import logo from "../assets/images/logo.svg";

const Header = () => {
    return (
        <div className="absolute top-6 left-6">
            <a href='/' className="inline-block">
                <img src={logo} className="w-16" alt="ProgressPal logo" />
            </a>
        </div>
    )
}

export default Header;
