import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: parcels = [] } = useQuery({
        queryKey: ['my-parcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });


    return (
        <div className="overflow-x-auto">
            <div>
                <h1 className="font-bold text-xl">All of my parcels: {parcels.length}</h1>
            </div>
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Parcel Name</th>
                        <th>Cost</th>
                        <th>Receiver Name</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        parcels.map((parcel, index) => <tr key={parcel._id}>
                        <th>{index + 1}</th>
                        <td>{parcel.senderName}</td>
                        <td>{parcel.parcelName}</td>
                        <td>{parcel.cost}</td>
                        <td>{parcel.receiverName}</td>
                        <td>payment status</td>
                        <td>action</td>
                    </tr>)
                    }
                    
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;