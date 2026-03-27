import React from 'react';
import './payment.css'
import { NavLink } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div className='h-screen flex items-center justify-center'>

            <div className="w-85 h-72 rounded-md shadow-2xl relative">

                {/* Centered circle */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        rounded-full w-20 h-20 bg-green-500 flex items-center justify-center ok">
                    <h4 className="capitalize text-[15px] text-white font-bold">Cancelled</h4>
                </div>

                <h1 className='payment-success mt-5'>You payment has been cancelled</h1>
                <NavLink to="/dashboard/my-parcels">
                    <button className='bg-green-500 rounded-xl p-2 shadow-xl text-white font-bold cursor-pointer go-back-btn'>Go Back</button>
                </NavLink>
            </div>
        </div>
    );
};

export default PaymentCancelled;