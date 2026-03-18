import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { FaArrowCircleRight } from "react-icons/fa";
import Logo from '../../components/logo/Logo';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import useTime from '../../custonHooks/useTime';

const Navbar = () => {
    const showTime = useTime();
    // console.log(showTime);
    const { user, logOut } = useAuth();
    const [menuState, setMenuState] = useState(false);
    // console.log(user);


    const handleMenu = () =>{
        setMenuState(!menuState);
    };

    const closeAuth = () => {
        logOut()
            .then()
            .catch(error => {
                // console.log(error.message);
                toast.error(error.message);
            });
    };

    const links = <>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/services">Services</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/coverage">Coverage</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/send-a-parcel">Send a Parcel</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/about-us">About Us</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/pricing">Pricing</NavLink></li>
        <li className="text-lg"><NavLink className={({ isActive }) => isActive ? "text-primary font-bold" : "text-accent"} to="/bearider">Be a Rider</NavLink></li>

    </>

    return (
        <div className="navbar shadow-sm lg:max-w-7xl mx-auto rounded-xl bg-white">
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
                <div className="flex items-center justify-center m-3  w-30 h-6">
                    <h3 className="text-[17px] text-primary font-bold">{showTime.toLocaleTimeString()}</h3>
                </div>
            </div>
            <div className="navbar-end flex gap-4 sm:ml-10">
                {
                    user ? <div className="rounded-full w-10 h-10 relative">
                        <div className="w-full h-full rounded-full cursor-pointer" onClick={handleMenu}>
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className={`border-3 border-white grow bg-secondary rounded-md w-55 flex items-left justify-left
                            flex-col absolute top-15 transition-all duration-400 origin-top z-10 ${menuState ? "opacity-100 visible" : "opcaity-0 invisible  transition-all duration-300"}`}>
                            <div className='w-40 p-5'>
                                <h3 className="font-bold text-white">{user.displayName}</h3>
                                <h3 className="font-medium text-white">{user.email}</h3>
                                <ul className="list-none">
                                    <li className="font-medium text-white cursor-pointer"><Link to="/dashboard">Dashboard</Link></li>
                                    <li className="font-medium text-white cursor-pointer"><Link to="/edit-profile">Edit Profile</Link></li>
                                </ul>
                                <button className="border border-white rounded-md font-bold p-2 mt-4 text-white hover:bg-secondary hover:text-primary cursor-pointer transition-all duration-300"
                                onClick={closeAuth}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div> : <Link to="/login">
                        <button className="text-sm cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner border border-gray-500 text-primary font-bold px-3 py-3 md:w-25 text-center rounded-xl md:text-xl">Log In</button>
                    </Link>
                }

                {
                    user ? <Link to="/register">
                        <div className="flex items-center overflow-hidden h-15">
                            <button className="text-sm cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner bg-secondary text-primary font-bold px-3 py-3 rounded-xl md:text-xl">Be a Rider</button>
                            <span className="md:text-4xl text-md sm:px-2 sm:py-5 -rotate-45"><FaArrowCircleRight /></span>
                        </div>
                    </Link>
                        :
                        <Link to="/register">
                            <div className="flex items-center overflow-hidden h-15">
                                <button className="text-sm cursor-pointer transition-all duration-150 active:scale-95 active:shadow-inner bg-secondary text-primary font-bold px-3 py-3 rounded-xl md:text-xl">Register</button>
                            </div>
                        </Link>
                }
            </div>
        </div>
    );
};

export default Navbar;