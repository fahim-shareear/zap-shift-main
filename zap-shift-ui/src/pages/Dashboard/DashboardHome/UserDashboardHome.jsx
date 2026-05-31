import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';

const UserDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading: parcelsLoading } = useQuery({
        queryKey: ['user-parcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['user-payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

    const isLoading = parcelsLoading || paymentsLoading;

    // Derived stats from parcels
    const totalParcels = parcels.length;
    const delivered = parcels.filter(p => p.deliveryStatus === 'delivered').length;
    const pending = parcels.filter(p =>
        ['parcel-created', 'parcel-paid', 'rider-assigned'].includes(p.deliveryStatus)
    ).length;
    const inTransit = parcels.filter(p => p.deliveryStatus === 'in-transit').length;

    // Derived stats from payments
    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const recentParcels = parcels.slice(0, 5);

    const statusStyles = {
        'delivered':      'bg-green-50 text-green-600',
        'parcel-created': 'bg-gray-100 text-gray-500',
        'parcel-paid':    'bg-blue-50 text-blue-600',
        'rider-assigned': 'bg-yellow-50 text-yellow-600',
        'in-transit':     'bg-purple-50 text-purple-600',
        'pending-pickup': 'bg-orange-50 text-orange-600',
    };

    const statusLabel = {
        'delivered':      'Delivered',
        'parcel-created': 'Created',
        'parcel-paid':    'Paid',
        'rider-assigned': 'Rider Assigned',
        'in-transit':     'In Transit',
        'pending-pickup': 'Pending Pickup',
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}
            <div className="mb-8">
                <p className="text-sm text-gray-400 mb-1">User Dashboard</p>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome back,{' '}
                    <span className="text-indigo-600">{user?.displayName}</span> 👋
                </h1>
                <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Parcels</p>
                            <p className="text-3xl font-semibold text-gray-800">{totalParcels}</p>
                            <p className="text-xs text-gray-400 mt-1">all time</p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Delivered</p>
                            <p className="text-3xl font-semibold text-green-500">{delivered}</p>
                            <p className="text-xs text-gray-400 mt-1">successfully</p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">In Progress</p>
                            <p className="text-3xl font-semibold text-yellow-500">{pending + inTransit}</p>
                            <p className="text-xs text-gray-400 mt-1">on the way</p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Spent</p>
                            <p className="text-3xl font-semibold text-indigo-600">
                                ৳{totalSpent.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">BDT</p>
                        </div>

                    </div>

                    {/* Recent Parcels + Payment Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Recent Parcels — 2/3 width */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                            <div className="mb-4">
                                <p className="text-base font-medium text-gray-700">Recent parcels</p>
                                <p className="text-xs text-gray-400">Your last 5 orders</p>
                            </div>

                            {recentParcels.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                    </svg>
                                    <p className="text-sm">No parcels yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {recentParcels.map((parcel, i) => (
                                        <div key={i} className="flex items-center justify-between py-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700 truncate">
                                                    {parcel.parcelName || 'Unnamed Parcel'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {parcel.trackingId} · To: {parcel.receiverName}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                <p className="text-sm font-medium text-gray-700">
                                                    ৳{parcel.cost || 0}
                                                </p>
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[parcel.deliveryStatus] || 'bg-gray-100 text-gray-500'}`}>
                                                    {statusLabel[parcel.deliveryStatus] || parcel.deliveryStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Summary — 1/3 width */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <div className="mb-4">
                                <p className="text-base font-medium text-gray-700">Payment history</p>
                                <p className="text-xs text-gray-400">Recent transactions</p>
                            </div>

                            {payments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <p className="text-sm">No payments yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {payments.slice(0, 5).map((pay, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 truncate">{pay.parcelName}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(pay.paidAt).toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-indigo-600 ml-3">
                                                ৳{pay.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Total */}
                                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                                        <p className="text-sm font-medium text-gray-700">Total spent</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            ৳{totalSpent.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default UserDashboardHome;