import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const AssignedJobs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['parcels', user.email, 'Rider Assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get("/parcels/riders", {
                params: {
                    riderEmail: user.email,
                    deliveryStatus: JSON.stringify(["rider-assigned", "pick-up-in-progress", "picked-up"])
                }
            });
            return res.data;
        }
    });

    const handleDeliveryStatusUpdate = (parcel, status) => {

        const statusMessage = {
            "pick-up-in-progress": {
                title: "Accept",
                text: "You want to accept this parcel?",
                successTitle: "Accepted!",
                successText: "Parcel has been assigned to you."
            },
            "pending-pickup": {
                title: "Reject",
                text: "You want to reject this parcel?",
                successTitle: "Rejected!",
                successText: "You have rejected ths parcel."
            },
            "picked-up": {
                title: "Pickup",
                text: "Confirm parcel pickup?",
                successTitle: "Picked up!",
                successText: "Parcel has been picked up."
            },
            "delivered": {
                title: "Delivered",
                text: "Confirm parcel delivery",
                successTitle: "Delivered!",
                successText: "Parcel has been delivered."
            }
        };

        const message = statusMessage[status];
        const statusInfo = {
            deliveryStatus: status,
            riderId: parcel.riderId,
            trackingId: parcel.trackingId
        };

        Swal.fire({
            title: "Are you sure?",
            text: message.text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo)
                    .then(res => {
                        // console.log(res.data.deliveryStatus);
                        if (res.data.modifiedCount) {
                            Swal.fire({
                                title: message.successTitle,
                                text: message.successText,
                                icon: "success"
                            });

                            refetch();
                        }
                    })
                    .catch(error => toast.error(error.message));
            }
        })
    };


    return (
        <div>
            <div>
                <h1 className="font-bold text-primary text-4xl px-3 py-3">Pending Jobs: {parcels.length}</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Parcel Type</th>
                            <th>Parcel Weight</th>
                            <th>Pickup Instruction</th>
                            <th>Pickup Address</th>
                            <th>Sender Contact</th>
                            <th>Receiver Address</th>
                            <th>Receiver Contact</th>
                            <th>Actions</th>
                            <th>Confirmation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) => <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td>{parcel.parcelName}</td>
                                <td>{parcel.parcelType}</td>
                                <td>{parcel.parcelWeight}</td>
                                <td>{parcel.pickupInstruction}</td>
                                <td>{parcel.senderAddress}</td>
                                <td>{parcel.senderPhone}</td>
                                <td>{parcel.receiverAddress}</td>
                                <td>{parcel.receiverPhone}</td>
                                <td>
                                    {
                                        parcel.deliveryStatus === "rider-assigned" ?
                                            <>
                                                <button
                                                    onClick={() => handleDeliveryStatusUpdate(parcel, "pick-up-in-progress")}
                                                    className="btn bg-secondary text-primary font-bold">Accept</button>
                                                <button
                                                    onClick={() => handleDeliveryStatusUpdate(parcel, "pending-pickup")}
                                                    className="btn btn-warning ms-2 font-bold">Reject</button>
                                            </>
                                            :
                                            parcel.deliveryStatus === "pick-up-in-progress" ?
                                            <>
                                                <span className='capitalize bg-secondary font-bold text-primary p-2 rounded-md'>parcel accepted</span>
                                            </>
                                            :
                                            <>
                                                <span className='capitalize bg-secondary font-bold text-primary p-2 rounded-md'>parcel rejected</span>
                                            </>
                                    }
                                </td>
                                <td>

                                    {   parcel.deliveryStatus === "pending-pickup"? " " :
                                        parcel.deliveryStatus === "picked-up" ?
                                            <button
                                                onClick={() => handleDeliveryStatusUpdate(parcel, "delivered")}
                                                className="btn bg-secondary mx-2">Parcel Delivered
                                            </button>

                                            :
                                            parcel.deliveryStatus === "delivered" ?
                                                <span className="bg-secondary text-primary font-bold p-2 rounded-md">Delivered
                                                </span>
                                                :
                                                <button
                                                    onClick={() => handleDeliveryStatusUpdate(parcel, "picked-up")}
                                                    className="btn bg-secondary">Confirm Pickup
                                                </button>

                                    }
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedJobs;