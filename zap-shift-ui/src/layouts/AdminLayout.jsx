import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import AdminError from '../pages/shared/AdminError';

const AdminLayout = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return <div className="flex items-center justify-center h-screen">
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    };

    if (role !== 'admin') {
        return <AdminError></AdminError>
    };

    return children;
};

export default AdminLayout;