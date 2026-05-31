import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const RiderDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcel = [], isLoading } = useQuery({
        queryKey: ['parcel-day-to-day', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders/delivery-per-day?email=${user.email}`);
            return res.data;
        }
    });

    const chartData = parcel
        .map(item => ({ date: item._id, deliveries: item.deliveryCount }))
        .sort((a, b) => {
            const [ad, am, ay] = a.date.split('-');
            const [bd, bm, by] = b.date.split('-');
            return new Date(`${ay}-${am}-${ad}`) - new Date(`${by}-${bm}-${bd}`);
        });

    const totalDeliveries = chartData.reduce((sum, d) => sum + d.deliveries, 0);
    const bestDay = chartData.reduce((best, d) => d.deliveries > (best?.deliveries ?? 0) ? d : best, null);

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}
            <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1">Rider Dashboard</p>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome back, <span className="text-indigo-600 uppercase">{user?.displayName}</span> 👋
                </h1>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total Deliveries</p>
                            <p className="text-3xl font-semibold text-gray-800">{totalDeliveries}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Active Days</p>
                            <p className="text-3xl font-semibold text-gray-800">{chartData.length}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Best Day</p>
                            <p className="text-3xl font-semibold text-gray-800">{bestDay?.deliveries ?? 0}</p>
                            {bestDay && (
                                <p className="text-xs text-gray-400 mt-1">{bestDay.date}</p>
                            )}
                        </div>
                    </div>

                    {/* Chart + Table Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Chart — takes 2/3 width */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                            <div className="mb-4">
                                <p className="text-base font-medium text-gray-700">Deliveries per day</p>
                                <p className="text-xs text-gray-400">Your delivery activity over time</p>
                            </div>

                            {chartData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-sm">No delivery data yet</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                                            cursor={{ fill: '#f3f4f6' }}
                                        />
                                        <Bar dataKey="deliveries" fill="#534AB7" radius={[4, 4, 0, 0]} maxBarSize={48} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Table — takes 1/3 width */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
                            <div className="mb-4">
                                <p className="text-base font-medium text-gray-700">Breakdown</p>
                                <p className="text-xs text-gray-400">Per-day delivery count</p>
                            </div>

                            {chartData.length === 0 ? (
                                <p className="text-sm text-gray-300 text-center mt-8">No data yet.</p>
                            ) : (
                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left pb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</th>
                                                <th className="text-right pb-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {chartData.map((row, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-2.5 text-gray-600">{row.date}</td>
                                                    <td className="py-2.5 text-right">
                                                        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                                            {row.deliveries}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-gray-200">
                                                <td className="pt-3 text-sm font-semibold text-gray-700">Total</td>
                                                <td className="pt-3 text-right text-sm font-semibold text-gray-700">{totalDeliveries}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default RiderDashboardHome;