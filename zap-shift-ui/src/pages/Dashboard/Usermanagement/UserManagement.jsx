import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { FaUserShield } from "react-icons/fa6";
import { HiUserRemove } from "react-icons/hi";
import Swal from 'sweetalert2';

const UserManagement = () => {
    const { loader } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearch(searchText);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: users = [], refetch, isLoading, isFetching } = useQuery({
        queryKey: ['users', debounceSearch],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?search=${debounceSearch}`);
            return res.data;
        }
    });

    const handleAdAdmin = users => {
        const roleInfo = { role: 'admin' };
        axiosSecure.patch(`/users/${users._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    Swal.fire({
                        title: "Are you sure?",
                        text: `You want to ${users.displayName} Admin?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirm"
                    }).then((result) => {
                        if (result.isConfirmed) Swal.fire({
                            title: "Success",
                            text: `${users.displayName} has been made Admin.`,
                            icon: "success"
                        });
                    });
                    refetch();
                }
            })
    };

    const handleRemoveAdmin = users => {
        const roleInfo = { role: "user" };
        axiosSecure.patch(`/users/${users._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    Swal.fire({
                        title: "Are you sure?",
                        text: `You want to ${users.displayName} remove from Admin?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirm"
                    }).then((result) => {
                        if (result.isConfirmed) Swal.fire({
                            title: "Success",
                            text: `${users.displayName} has been removed from Admin.`,
                            icon: "success"
                        });
                    });
                    refetch();
                }
            })
    };

    // Only block UI on very first load, not on every search
    if (isLoading) {
        return <div className="flex justify-center items-center h-40">{loader}</div>;
    }

    return (
        <div className="p-4">
            {/* Redesigned Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className='font-bold text-xl'>Total platform users: {users.length}</h1>

                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {/* Subtle spinner — only shows during re-searches, not first load */}
                    {isFetching && !isLoading && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Joined At</th>
                            <th>Other Actions</th>
                        </tr>
                    </thead>
                    <tbody className={isFetching ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity'}>
                        {
                            isFetching ? null : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                            </svg>
                                            <p className="font-semibold text-lg">No users found</p>
                                            <p className="text-sm">Try searching with a different name or email</p>
                                        </div>
                                    </td>
                                </tr>
                            ) :

                                (
                                    users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle h-12 w-12">
                                                            <img src={user.photoURL} alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="font-bold">{user.displayName}</div>
                                                </div>
                                            </td>
                                            <td><span className="capitalize font-bold">{user.role}</span></td>
                                            <td>{user.email}</td>
                                            <td>
                                                {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="flex items-center gap-5">
                                                {user.role === 'admin' ?
                                                    <button onClick={() => handleRemoveAdmin(user)} className='btn font-bold text-[18px] bg-red-500 text-white'><HiUserRemove /></button>
                                                    :
                                                    <button onClick={() => handleAdAdmin(user)} className='btn font-bold text-[18px] bg-green-500 text-white'><FaUserShield /></button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;