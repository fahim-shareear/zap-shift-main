import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoutes = ({ children }) => {
    const {user, loader} = useAuth();

    if(loader) {
        return <span className="loading loading-infinity loading-xl"></span>
    };

    if(!user) {
        return <Navigate to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoutes;