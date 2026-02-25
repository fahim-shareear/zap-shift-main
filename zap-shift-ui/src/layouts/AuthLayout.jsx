import React from 'react';
import Logo from '../components/logo/Logo';
import { Outlet } from 'react-router';
import authimage from "../assets/authImage.png"

const AuthLayout = () => {
    return (
        <div className="md:max-w-7xl mx-auto p-3 w-full">
            <div className="w-40 pl-2">
                <Logo></Logo>
            </div>
            <div className="flex mt-10 md:flex-row flex-col-reverse">
                <div className="flex-1 mt-15">
                    <Outlet></Outlet>
                </div>
                <div className="flex-1 mt-15 bg-[#caeb66] h-full">
                    <img src={authimage} alt="authimage" className="h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;