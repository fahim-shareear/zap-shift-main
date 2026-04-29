import React from 'react';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { TfiReload } from "react-icons/tfi";
import useAuth from '../../../hooks/useAuth';
import { FaUserShield } from "react-icons/fa6";
import { HiUserRemove } from "react-icons/hi";
import Swal from 'sweetalert2';

const UserManagement = () => {
    const { loader } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch, isLoading, isFetching } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-40">{loader}</div>;
    };

    const handleAdAdmin = users => {
        const roleInfo = { role: 'admin' };
        axiosSecure.patch(`/users/${users._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
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
                }
            })
    };

    const handleRemoveAdmin = users => {
        const roleInfo = { role: "user" };
        axiosSecure.patch(`/users/${users._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
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
                }
            })
    };



    return (
        <div>
            <div>
                <h1>Total platform users: {users.length}</h1>
            </div>

            <div className="overflow-x-auto">

                <div className="relative">

                    {/* 🔄 Overlay loader */}
                    {isFetching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                            {loader}
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Joined At</th>
                                <th>Other Actions</th>
                                <th>
                                    <button
                                        onClick={() => refetch()}
                                        disabled={isFetching}
                                        className="flex items-center gap-2"
                                    >
                                        <TfiReload className={isFetching ? 'animate-spin' : ''} />
                                    </button>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {
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
                                                <div className="font-bold">
                                                    {user.displayName}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="capitalize font-bold">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        <td className="flex items-center gap-5">
                                            {
                                                user.role === 'admin' ?
                                                    <button
                                                        onClick={() => handleRemoveAdmin(user)}
                                                        className='btn font-bold text-[18px] bg-red-500'><HiUserRemove /></button>

                                                    :

                                                    <button
                                                        onClick={() => handleAdAdmin(user)}
                                                        className='btn font-bold text-[18px] bg-green-500'><FaUserShield /></button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default UserManagement;