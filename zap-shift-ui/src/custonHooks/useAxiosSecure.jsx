import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const { user } = useAuth();

    useEffect(() => {
        // intercept request:
        axiosSecure.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })
    }, [user])

    return axiosSecure;
};

export default useAxiosSecure;