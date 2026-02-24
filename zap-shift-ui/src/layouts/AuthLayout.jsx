import React from 'react';
import Logo from '../components/logo/Logo';
import { Outlet } from 'react-router';
import authimage from "../assets/authImage.png"

const AuthLayout = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <Logo></Logo>
            <div className="flex mt-10">
                <div className="flex-1 mt-15">
                    <Outlet></Outlet>
                </div>
                <div className="flex-1 mt-15">
                    <img src={authimage} alt="authimage" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;