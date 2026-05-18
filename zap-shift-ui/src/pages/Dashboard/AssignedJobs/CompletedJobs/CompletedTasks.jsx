import React from 'react';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

const CompletedTasks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    const { data: parcels = [] } = useQuery({
        queryKey: ['parcels', user.email, 'Rider Assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get("/parcels/riders", {
                params: {
                    riderEmail: user.email,
                    deliveryStatus: JSON.stringify(["delivered"])
                }
            });
            // console.log(res.data);
            return res.data;
        }
    });

    //checking if the parcel commission if submitted for payroll:
    const {data: existingPayroll} = useQuery({
        queryKey: ['payroll', user.email],
        queryFn: async () =>{
            const currentMonth = new Date().toLocaleString('default', {month: 'long', year: 'numeric'});
            const res = await axiosSecure.get(`/payroll/${user.email}`)
            const submitted = res.data.some(p => p.month === currentMonth);
            return submitted
        }
    });

    useEffect(() => {
        if(existingPayroll){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSubmitted(true);
        }
    }, [existingPayroll]);

    const calculatePayout = parcel => {
        if (parcel.senderDistrict === parcel.receiverDistrict) {
            return parcel.cost * 0.4;
        } else {
            return parcel.cost * 0.6;
        }
    };

    //total commission calculation:
    const totalCommissionCalculation = parcels.reduce((total, parcel) => {
        return total + calculatePayout(parcel);
    }, 0)

    //submit commission to the backend:
    const handleSubmitCommission = async () => {
        setIsSubmitting(true);

        const payrollData = {
            riderEmail: user.email,
            riderName: user.displayName,
            totalCommission: totalCommissionCalculation,
            parcelCount: parcels.length,
            submittedDate: new Date().toLocaleDateString(),
            month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
        };

        Swal.fire({
            title: "Are you sure?",
            text: "Your commission amount is correct?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.post("/payroll/add-commissions", payrollData)
                    .then(res => {
                        if (res.data.success) {
                            setIsSubmitted(true);
                            Swal.fire({
                                title: "Commission has been submitted",
                                text: "Proceeding for payroll",
                                icon: "success"
                            });
                        }
                    })
                    .catch(error => {
                        if (error.response?.status === 409) {
                            setIsSubmitted(true);
                            Swal.fire({
                                title: "Error",
                                text: error.response?.data?.message || "Failed to submit commission",
                                icon: "error"
                            });
                        }
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            } else {
                setIsSubmitting(false);
            }
        });
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-primary px-3 py-3 text-4xl">Completed Tasks: {parcels.length}</h1>
                <div className="px-2 py-3">
                    {
                        parcels.length > 0 && (
                            <>
                                <div className="flex items-center justify-center bg-secondary text-primary rounded-md px-4 py-3 gap-4">
                                    <div className="flex items-center justify-around gap-3">
                                        <p>Total Commission for this month: </p>
                                        <p className="font-bold text-primary bg-white rounded-md px-2 py-2 text-[18px]">{totalCommissionCalculation.toFixed(2)}</p>
                                        <p>Total parcel delivered this month: <span className="font-bold text-primary bg-white rounded-md px-2 py-2 text-[18px]">{parcels.length}</span></p>
                                    </div>
                                    <button
                                        onClick={handleSubmitCommission}
                                        disabled={isSubmitted || isSubmitting}
                                        className="btn bg-white text-primary font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitted ? "Alreday Submitted" : isSubmitting ? 'Submitting...' : 'Submit for payroll'}
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Parcel Type</th>
                                <th>Parcel Weight</th>
                                <th>Sender District</th>
                                <th>Sender Address</th>
                                <th>Receiver District</th>
                                <th>Receiver Address</th>
                                <th>Parcel Price</th>
                                <th>Commission amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parcels.map((parcel, index) =>
                                (<tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.parcelType}</td>
                                    <td>{parcel.parcelWeight}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td>{parcel.senderAddress}</td>
                                    <td>{parcel.receiverDistrict}</td>
                                    <td>{parcel.receiverAddress}</td>
                                    <td>{parcel.cost}</td>
                                    <td>{calculatePayout(parcel)}</td>
                                </tr>)
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompletedTasks;