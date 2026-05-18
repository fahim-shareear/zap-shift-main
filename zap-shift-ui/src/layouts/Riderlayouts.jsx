import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import AdminError from '../pages/shared/AdminError';

const Riderlayouts = ({ children }) => {
    const { loading, user } = useAuth();
    const { role, reloading } = useRole();

    if (loading || !user || reloading) {
        return <div className="flex items-center justify-center h-screen">
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    };

    if(role !== 'rider'){
        return <AdminError></AdminError>
    };


    return children;
};

export default Riderlayouts;