import React from 'react';
import logo from "../assets/images/logo.svg";

const Footer = () => {
    return (
        <div className="pl-7 pt-7">
            <a href='/'><img src={logo} className="flex w-1/12" alt="ProgressPal logo"/></a>
        </div>
    )
}

export default Footer;