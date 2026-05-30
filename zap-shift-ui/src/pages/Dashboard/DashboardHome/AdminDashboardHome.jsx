import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statusConfig = {
    'parcel-created':      { label: 'Parcel Created',      color: 'text-blue-500' },
    'parcel-paid':         { label: 'Parcel Paid',          color: 'text-green-500' },
    'rider-assigned':      { label: 'Rider Assigned',       color: 'text-purple-500' },
    'in-transit':          { label: 'In Transit',           color: 'text-yellow-500' },
    'delivered':           { label: 'Delivered',            color: 'text-emerald-500' },
    'pending-pickup':      { label: 'Pending Pickup',       color: 'text-orange-500' },
    'cancelled':           { label: 'Cancelled',            color: 'text-red-500' },
    'pick-up-in-progress': { label: 'Pickup In Progress',   color: 'text-cyan-500' },
};

// Hex colors for Recharts (Tailwind class কাজ করে না Recharts-এ)
const statusColors = {
    'parcel-created':      '#3b82f6',
    'parcel-paid':         '#22c55e',
    'rider-assigned':      '#a855f7',
    'in-transit':          '#eab308',
    'delivered':           '#10b981',
    'pending-pickup':      '#f97316',
    'cancelled':           '#ef4444',
    'pick-up-in-progress': '#06b6d4',
};

const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();
    const { data: deliveryStatus = [], isLoading } = useQuery({
        queryKey: ['delivery-status-stat'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/devlivery-status/stats/');
            return res.data;
        }
    });

    const totalParcels = deliveryStatus.reduce((sum, s) => sum + s.count, 0);

    // Step 1: Recharts-এর জন্য data transform
    const chartData = deliveryStatus.map(stat => ({
        name: statusConfig[stat._id]?.label || formatStatus(stat._id),
        value: stat.count,
        id: stat._id
    }));

    return (
        <div>
            <h1 className="font-bold text-2xl text-primary px-10 py-10">Welcome Admin</h1>

            {/* Total summary card */}
            <div className="md:max-w-7xl mx-auto px-4 mb-6">
                <div className="bg-primary text-primary-content rounded-xl p-6 inline-block shadow">
                    <p className="text-lg font-semibold opacity-80">Total Parcels</p>
                    <p className="text-5xl font-bold">{isLoading ? '...' : totalParcels}</p>
                </div>
            </div>

            {/* Status breakdown grid */}
            <div className="md:max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {isLoading
                        ? Array(4).fill(0).map((_, i) => (
                            <div key={i} className="card bg-base-100 shadow animate-pulse h-32" />
                        ))
                        : deliveryStatus.map((stat) => {
                            const config = statusConfig[stat._id];
                            const label = config?.label || formatStatus(stat._id);
                            const icon = config?.icon || '🔖';
                            const color = config?.color || 'text-primary';

                            return (
                                <div key={stat._id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="card-body">
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl">{icon}</span>
                                            <span className={`text-4xl font-bold ${color}`}>{stat.count}</span>
                                        </div>
                                        <h3 className={`font-semibold text-sm mt-2 ${color}`}>{label}</h3>
                                        <p className="text-xs text-base-content/50">
                                            {totalParcels > 0
                                                ? ((stat.count / totalParcels) * 100).toFixed(1)
                                                : 0}% of total
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Pie Chart Section */}
            <div className="md:max-w-7xl mx-auto px-4 mt-10">
                <div className="card bg-base-100 shadow-md p-6">
                    <h2 className="text-xl font-bold text-primary mb-4">Delivery Status Overview</h2>
                    {isLoading ? (
                        <div className="h-64 animate-pulse bg-base-200 rounded-xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(1)}%`
                                    }
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={statusColors[entry.id] || '#8884d8'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value} parcels`, 'Count']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboardHome;