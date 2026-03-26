import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../../custonHooks/useAxiosSecure';

const Payment = () => {
    const { parcelId } = useParams();
    const axiosSecure = useAxiosSecure();
    const { isLoading, data: parcel } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            // console.log(res.data);
            return res.data;
        }
    });

    const handlePayment = async () =>{
        const paymentInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        console.log(res.data);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    }

    return (
        <div>
            <h2>Please Pay: ${parcel.cost}</h2>
            <h2>{parcel.parcelName}</h2>
            <button className='btn btn-secondary text-black' onClick={handlePayment}>Pay</button>
        </div>
    );
};

export default Payment;