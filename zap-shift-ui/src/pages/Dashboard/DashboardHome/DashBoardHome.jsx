import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';
import Loader from '../../shared/Loader';

const DashBoardHome = () => {
    const {role, roleLoading} = useRole();

    if(roleLoading){
        return <Loader></Loader>
    };

    if(role === 'admin'){
        return <AdminDashboardHome></AdminDashboardHome>
    }else if(role === 'rider'){
        return <RiderDashboardHome></RiderDashboardHome>
    }else{
        return <UserDashboardHome></UserDashboardHome>
    }
};

export default DashBoardHome;