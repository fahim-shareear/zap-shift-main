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
        <div>
            <h1>All my parcels here: {parcels.length}</h1>
        </div>
    );
};

export default MyParcels;