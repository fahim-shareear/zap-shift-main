import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();
    const { data: deliveryStatus = [] } = useQuery({
        queryKey: ['delivery-status-stat'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/devlivery-status/stats/');
            console.log(res.data);
            return res.data;
        }
    })
    return (
        <div>
            <h1 className="font-bold text-2xl text-primary px-10 py-10">Welcome Admin</h1>
            <div className="md:max-w-7xl mx-auto">
                <div className="stats stats-vertical lg:stats-horizontal shadow">
                    {
                        deliveryStatus.map((stat, index) => (
                            <div className="stat" key={index}>
                                <div className="stat-title capitalize text-xl font-bold text-primary">{stat._id}</div>
                                <div className="stat-value text-primary">{stat.count}</div>
                                {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                            </div>))
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;