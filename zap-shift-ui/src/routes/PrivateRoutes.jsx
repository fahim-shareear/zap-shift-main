import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoutes = ({ children }) => {
    const { user, loader } = useAuth();

    if (loader) {
        return <div className="flex items-center justify-center h-screen">
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    };

    if (!user) {
        return <Navigate to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoutes;