import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <>
            <Link to="/">
                <div className="flex items-end m-2">
                    <img src={logo} alt="zap-shift logo" />
                    <h3 className="font-bold text-2xl -ms-2.5 text-primary">ZapShift</h3>
                </div>
            </Link>
        </>
    );
};

export default Logo;