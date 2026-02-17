import React from 'react';
import { NavLink } from 'react-router';
import { FaArrowCircleRight } from "react-icons/fa";
import Logo from '../../utils/Logo';

const Navbar = () => {
    const links = <>
        <li className="text-lg"><NavLink className={({isActive}) => isActive ? "text-primary font-bold" : "text-accent"} to="/services">Services</NavLink></li>
        <li className="text-lg"><NavLink className={({isActive}) => isActive ? "text-primary font-bold" : "text-accent"} to="/coverage">Coverage</NavLink></li>
        <li className="text-lg"><NavLink className={({isActive}) => isActive ? "text-primary font-bold" : "text-accent"} to="/about-us">About Us</NavLink></li>
        <li className="text-lg"><NavLink className={({isActive}) => isActive ? "text-primary font-bold" : "text-accent"} to="/pricing">Pricing</NavLink></li>
        <li className="text-lg"><NavLink className={({isActive}) => isActive ? "text-primary font-bold" : "text-accent"} to="/bearider">Be a Rider</NavLink></li>

    </>

    return (
        <div className="navbar shadow-sm lg:max-w-7xl mx-auto">
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
        <div className="navbar-end flex gap-4">
            <button className="cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner border border-gray-500 text-primary font-bold p-3 w-25 text-center rounded-md text-xl">Log In</button>

            <button className="cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner flex items-center gap-3 bg-secondary text-primary font-bold p-3 rounded-md text-xl">Be a Rider <span className="text-3xl -rotate-45"><FaArrowCircleRight /></span></button>
        </div>
        </div>
    );
};

export default Navbar;