import React, { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router';
import useAxiosSecure from '../../../../custonHooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const [paymentInfo, setPaymentInfo] = useState();
    console.log(sessionId);
    useEffect(() => {
        if(sessionId){
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    console.log(res.data);
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId
                    })
                })
                .catch(error => {
                    console.log(error.data);
                })
        }
    }, [sessionId, axiosSecure]);
    
    return (
        <div className='h-screen flex items-center justify-center'>

            <div className="w-72 h-72 rounded-md shadow-2xl relative">

                {/* Centered circle */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        rounded-full w-15 h-15 bg-green-500 flex items-center justify-center ok">
                    <h4 className="capitalize text-xl text-white font-bold">ok</h4>
                </div>

                <h1 className='payment-success'>Payment Successful</h1>
                <h1>Your Transaction ID: {paymentInfo?.transactionId}</h1>
                <h1>Your Tracking ID: {paymentInfo?.trackingId}</h1>
                <NavLink to="/dashboard/my-parcels">
                    <button className='bg-green-500 rounded-xl p-2 shadow-xl text-white font-bold cursor-pointer go-back-btn'>Go Back</button>
                </NavLink>
            </div>
        </div>
    );
};

export default PaymentSuccess;