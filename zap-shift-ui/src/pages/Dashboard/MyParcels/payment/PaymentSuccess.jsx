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
        <div className='h-screen flex items-left gap-5 justify-center flex-col'>
                <h1 className='payment-success'>Payment Successful</h1>
                <h1>Your Transaction ID: {paymentInfo?.transactionId}</h1>
                <h1>Your Tracking ID: {paymentInfo?.trackingId}</h1>
        </div>
    );
};

export default PaymentSuccess;