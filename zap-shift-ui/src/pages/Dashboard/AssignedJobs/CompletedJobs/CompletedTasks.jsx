import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../custonHooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const CompletedTasks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionInfo, setSubmissionInfo] = useState({
        isSubmitted: false,
        isUpdated: false
    });

    const { data: parcels = [] } = useQuery({
        queryKey: ['parcels', user.email, 'Rider Assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get("/parcels/riders", {
                params: {
                    riderEmail: user.email,
                    deliveryStatus: JSON.stringify(["delivered"])
                }
            });
            return res.data;
        }
    });

    // ✅ Fetch existing payroll for current month
    const { data: existingPayroll, refetch: refetchPayroll } = useQuery({
        queryKey: ['payroll', user.email],
        queryFn: async () => {
            const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
            const res = await axiosSecure.get(`/payroll/${user.email}`);
            const submitted = res.data.find(p => p.month === currentMonth);
            return submitted;
        }
    });

    const calculatePayout = parcel => {
        if (parcel.senderDistrict === parcel.receiverDistrict) {
            return parcel.cost * 0.4;
        } else {
            return parcel.cost * 0.6;
        }
    };

    const totalCommissionCalculation = parcels.reduce((total, parcel) => {
        return total + calculatePayout(parcel);
    }, 0);

    // ✅ Check if data has changed compared to submitted record
    const hasDataChanged = () => {
        if (!existingPayroll) return false;
        return existingPayroll.totalCommission !== totalCommissionCalculation ||
               existingPayroll.parcelCount !== parcels.length;
    };

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

        const actionType = existingPayroll ? "Update" : "Submit";

        Swal.fire({
            title: `Are you sure?`,
            text: `${actionType} commission amount: ${totalCommissionCalculation.toFixed(2)}`,
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
                            setSubmissionInfo({
                                isSubmitted: true,
                                isUpdated: res.data.isUpdated || false
                            });

                            Swal.fire({
                                title: res.data.isUpdated ? "Commission Updated!" : "Commission Submitted!",
                                text: res.data.message,
                                icon: "success"
                            });

                            // Refetch payroll to update UI
                            refetchPayroll();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        Swal.fire({
                            title: "Error",
                            text: error.response?.data?.message || "Failed to submit commission",
                            icon: "error"
                        });
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            } else {
                setIsSubmitting(false);
            }
        });
    };

    // ✅ Button should be enabled if:
    // - There are parcels to submit
    // - AND (no previous submission OR data has changed)
    const isButtonDisabled = parcels.length === 0 || 
                             (submissionInfo.isSubmitted && !hasDataChanged());

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-primary px-3 py-3 text-4xl">
                    Completed Tasks: {parcels.length}
                </h1>
                <div className="px-2 py-3">
                    {parcels.length > 0 && (
                        <>
                            <div className="flex items-center justify-center bg-secondary text-primary rounded-md px-4 py-3 gap-4">
                                <div className="flex items-center justify-around gap-3">
                                    <p>Total Commission for this month:</p>
                                    <p className="font-bold text-primary bg-white rounded-md px-2 py-2 text-[18px]">
                                        {totalCommissionCalculation.toFixed(2)}
                                    </p>
                                    <p>Total parcel delivered this month: 
                                        <span className="font-bold text-primary bg-white rounded-md px-2 py-2 text-[18px]">
                                            {parcels.length}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleSubmitCommission}
                                    disabled={isButtonDisabled || isSubmitting}
                                    className="btn bg-white text-primary font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={hasDataChanged() ? "New data detected - click to update" : ""}
                                >
                                    {isSubmitting ? 'Processing...' : 
                                     submissionInfo.isSubmitted && hasDataChanged() ? 'Update Commission' :
                                     submissionInfo.isSubmitted ? 'Submitted' : 
                                     'Submit for Payroll'}
                                </button>

                                {/* ✅ Show indicator if data changed */}
                                {submissionInfo.isSubmitted && hasDataChanged() && (
                                    <span className="badge badge-warning animate-pulse">New Data!</span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Table remains the same */}
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra text-center">
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
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompletedTasks;