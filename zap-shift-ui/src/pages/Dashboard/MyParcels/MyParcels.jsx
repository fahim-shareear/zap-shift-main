import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaEye } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const parcelDelete = (id) => {
        console.log(id);
        Swal.fire({
            title: "Are you sure?!",
            text: "You won't able to revert it.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "I agree!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.deletedCount) {
                             //refresh the ui
                            refetch();
                            Swal.fire({
                                title: "Success!",
                                text: "Your order has been canceled.",
                                icon: "success"
                            });
                           
                        };
                    })
                    .catch(error =>{
                        console.log(error.message);
                        return
                    });
            };
        });
    }

    return (
        <div className="overflow-x-auto">
            <div>
                <h1 className="font-bold text-xl">All of my parcels: {parcels.length}</h1>
            </div>
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Parcel Name</th>
                        <th>Cost</th>
                        <th>Receiver Name</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        parcels.map((parcel, index) => <tr key={parcel._id}>
                            <th>{index + 1}</th>
                            <td>{parcel.senderName}</td>
                            <td>{parcel.parcelName}</td>
                            <td>{parcel.cost}</td>
                            <td>{parcel.receiverName}</td>
                            <td>payment status</td>
                            <td>
                                <button className='btn btn-square'>
                                    <FaEye />
                                </button>

                                <button className='btn btn-square mx-2'>
                                    <RiEdit2Fill />
                                </button>

                                <button className='btn btn-square' onClick={() => parcelDelete(parcel._id)}>
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;