import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';

const DashBoardHome = () => {
    const {role} = useRole();

    if(role === 'admin'){
        return <AdminDashboardHome></AdminDashboardHome>
    }else if(role === 'rider'){
        return <RiderDashboardHome></RiderDashboardHome>
    }else{
        return <UserDashboardHome></UserDashboardHome>
    }
};

export default DashBoardHome;