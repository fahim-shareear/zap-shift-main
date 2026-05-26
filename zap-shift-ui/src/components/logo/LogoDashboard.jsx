import React from 'react';
import logo from "../../assets/logo.png"
import { Link } from 'react-router';

const LogoDashboard = () => {
    return (
        <>
            <Link to="/">
                <div className="flex items-end md:m-2 mr-3 transition-all duration-150 active:scale-95 active:shadow-inner">
                    <img src={logo} alt="zap-shift logo" />
                    <h3 className="font-bold text-2xl -ms-2.5">ZapShift Dashboard</h3>
                </div>
            </Link>
        </>
    );
};

export default LogoDashboard;