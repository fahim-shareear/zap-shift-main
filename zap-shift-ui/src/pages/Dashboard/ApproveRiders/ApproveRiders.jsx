import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { IoPersonAdd } from "react-icons/io5";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const { data: riders = [], refetch } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    });

    const handleAction = (id, action) => {
        const modal = document.getElementById(`modal_${id}`);

        if(modal){
            modal.close();
        };


        let request;
        let successMessage = "";
        let iconType = "success";


        switch (action) {
            case 'approve':
                request = axiosSecure.patch(`/riders/${id}`, { status: 'approved' });
                successMessage = "Rider Request has been Approved";
                iconType = "success";
                break;

            case 'reject':
                request = axiosSecure.patch(`/riders/${id}`, { status: 'rejected' });
                successMessage = "Rider Request has been Rejected";
                iconType = "warning";
                break;

            case 'delete':
                request = axiosSecure.delete(`/riders/${id}`);
                successMessage = "Rider has been Deleted";
                iconType = "error";
                break;
            default:
                return;
        }

        request
            .then(res => {
                if (res.data.modifiedCount > 0 || res.data.deletedCount > 0) {
                    refetch()
                    Swal.fire({
                        position: "center",
                        icon: iconType,
                        title: successMessage,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            })
            .catch(() => {
                return toast.error("Something Went Wrong");
            })
    };


    return (
        <div>
            <h1 className="font-bold text-2xl ml-5">Riders Pending Application: {riders.length}</h1>
            <div className="ml-5">
                <div className="overflow-x-auto">
                    <table className="table table-zebra md:max-w-7xl mx-auto">
                        {/* head */}
                        <thead>
                            <tr className="text-center">
                                <th>SL No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {/* row 1 */}
                            {
                                riders.map((rider, index) =>
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{rider.riderName}</td>
                                        <td>{rider.riderEmail}</td>
                                        <td className={`capitalize ${rider.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{rider.status}</td>
                                        <td>
                                            {/* You can open the modal using document.getElementById('ID').showModal() method */}
                                            {/* Trigger Button - Using unique ID */}
                                            <button
                                                className="btn"
                                                onClick={() => document.getElementById(`modal_${rider._id}`).showModal()}
                                            >
                                                <FaEye className="text-xl text-info" />
                                            </button>

                                            <dialog id={`modal_${rider._id}`} className="modal">
                                                <div className="modal-box w-11/12 max-w-3xl"> {/* Increased width for 2-column layout */}
                                                    <form method="dialog">
                                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                    </form>

                                                    <h3 className="font-bold text-2xl mb-6 border-b pb-2">Rider Application Details</h3>

                                                    <div className="flex flex-col md:flex-row gap-8">
                                                        {/* Left Column: Profile Photo */}
                                                        <div className="md:w-1/3">
                                                            <div className="rounded-2xl overflow-hidden border-4 border-base-200 shadow-md">
                                                                <img
                                                                    src={rider.riderImage}
                                                                    alt={rider.riderName}
                                                                    className="w-full h-64 object-cover"
                                                                />
                                                            </div>
                                                            <div className="mt-4 text-center">
                                                                <span className={`badge badge-lg capitalize ${rider.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                                                    {rider.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Right Column: Information Grid */}
                                                        <div className="md:w-2/3">
                                                            <div className="grid grid-cols-1 gap-4">
                                                                <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                                                                    <p className="text-xs uppercase text-gray-500 font-bold">Full Name</p>
                                                                    <p className="text-lg font-semibold">{rider.riderName}</p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                                                                        <p className="text-xs uppercase text-gray-500 font-bold">Region</p>
                                                                        <p className="font-medium">{rider.riderRegion}</p>
                                                                    </div>
                                                                    <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                                                                        <p className="text-xs uppercase text-gray-500 font-bold">District</p>
                                                                        <p className="font-medium">{rider.district}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                                                                    <p className="text-xs uppercase text-gray-500 font-bold">Vehicle & License</p>
                                                                    <p className="font-medium">{rider.riderBikeInfo}</p>
                                                                    <p className="text-sm text-gray-600">No: {rider.riderBikeRegistrationNumber}</p>
                                                                </div>

                                                                <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
                                                                    <p className="text-xs uppercase text-gray-500 font-bold">Short Bio</p>
                                                                    <p className="text-sm italic text-gray-700">{rider.riderBio}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons inside Modal (Optional) */}
                                                    <div className="modal-action">
                                                        <button className="btn mr-2" onClick={() => handleAction(rider._id, 'approve')}>
                                                            <IoPersonAdd />
                                                        </button>

                                                        <button className="btn mr-2" onClick={() => handleAction(rider._id, 'reject')}>
                                                            <IoPersonRemoveSharp />
                                                        </button>

                                                        <button className="btn mr-2" onClick={() => handleAction(rider._id, 'delete')}>
                                                            <AiFillDelete />
                                                        </button>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApproveRiders;