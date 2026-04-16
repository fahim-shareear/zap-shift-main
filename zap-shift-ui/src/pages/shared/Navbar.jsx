import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router'; // Ensure this matches your router package
import { FaArrowCircleRight, FaUserAlt, FaSignOutAlt, FaThLarge, FaBoxOpen, FaUserEdit } from "react-icons/fa";
import Logo from '../../components/logo/Logo';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import useTime from '../../custonHooks/useTime';

const Navbar = () => {
    const showTime = useTime();
    const { user, logOut } = useAuth();
    const [menuState, setMenuState] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuState(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenu = () => setMenuState(!menuState);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success("Logged out successfully");
                setMenuState(false);
            })
            .catch(error => toast.error(error.message));
    };

    const links = (
        <>
            <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent hover:text-primary"} to="/services">Services</NavLink></li>
            <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent hover:text-primary"} to="/coverage">Coverage</NavLink></li>
            <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent hover:text-primary"} to="/send-a-parcel">Send a Parcel</NavLink></li>
            <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent hover:text-primary"} to="/about-us">About Us</NavLink></li>
            <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent hover:text-primary"} to="/pricing">Pricing</NavLink></li>
            <li className="text-lg"><NavLink className="bg-secondary font-bold cursor-pointer" to="/be-a-rider">Be a Rider</NavLink></li>
        </>
    );

    return (
        <nav className="navbar shadow-md lg:max-w-7xl mx-auto rounded-xl bg-white fixed top-4 left-0 right-0 z-100 px-4 md:px-8">
            {/* Navbar Start: Mobile Menu & Logo */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-0 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-xl border border-gray-100">
                        {links}
                    </ul>
                </div>
                <Logo />
            </div>

            {/* Navbar Center: Desktop Links & Clock */}
            <div className="navbar-center hidden lg:flex items-center gap-6">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {links}
                </ul>
                <div className="bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
                    <h3 className="text-sm font-mono text-primary font-bold">
                        {showTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </h3>
                </div>
            </div>

            {/* Navbar End: Auth Logic */}
            <div className="navbar-end flex items-center gap-3">
                {user ? (
                    /* User is logged in: Show only Profile Dropdown */
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={handleMenu}
                            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors duration-200 border-2 border-secondary"
                        >
                            <img 
                                src={user?.photoURL || 'https://via.placeholder.com/150'} 
                                alt="User Profile" 
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="hidden md:block text-sm font-bold text-gray-700">{user.displayName}</span>
                        </button>

                        {/* Dropdown Menu Container */}
                        <div className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 transition-all duration-300 origin-top-right z-110 
                            ${menuState ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                            
                            {/* Profile Header */}
                            <div className="px-6 pb-4 border-b border-gray-100 mb-2">
                                <p className="font-bold text-gray-800 truncate">{user?.displayName}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>

                            {/* Links List */}
                            <ul className="px-2 space-y-1">
                                <li>
                                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                                        <FaThLarge className="text-sm" /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/my-parcels" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                                        <FaBoxOpen className="text-sm" /> My Parcels
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/edit-profile" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                                        <FaUserEdit className="text-sm" /> Edit Profile
                                    </Link>
                                </li>
                            </ul>

                            {/* Logout Button */}
                            <div className="px-4 mt-4">
                                <button 
                                    onClick={handleLogOut}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                                >
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* User is NOT logged in: Show Login and Register */
                    <div className="flex items-center gap-2">
                        <Link to="/login">
                            <button className="px-5 py-2 text-sm md:text-base font-bold text-primary border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                Log In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="flex items-center gap-2 px-5 py-2 text-sm md:text-base font-bold text-primary bg-secondary rounded-xl hover:shadow-lg active:scale-95 transition-all">
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;