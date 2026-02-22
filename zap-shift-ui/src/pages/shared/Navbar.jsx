import React from 'react';
import { NavLink } from 'react-router';
import { FaArrowCircleRight } from "react-icons/fa";
import Logo from '../../components/logo/Logo';

const Navbar = () => {
    const links = <>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/services">Services</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/coverage">Coverage</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/about-us">About Us</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/pricing">Pricing</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/bearider">Be a Rider</NavLink></li>

    </>

    return (
        <div className="navbar shadow-sm lg:max-w-7xl mx-auto rounded-xl bg-white fixed z-100 top-0">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Logo></Logo>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end flex gap-4 sm:ml-10">
                <button className="text-sm cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner border border-gray-500 text-primary font-bold px-3 py-3 w-25 text-center rounded-xl md:text-xl">Log In</button>

                <div className="flex items-center">
                    <button className="text-sm cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner bg-secondary text-primary font-bold px-3 py-3 rounded-xl md:text-xl">Be a Rider</button>
                    <span className="md:text-4xl text-md sm:px-2 sm:py-5 -rotate-45"><FaArrowCircleRight /></span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;