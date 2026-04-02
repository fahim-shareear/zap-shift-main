import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            // console.log(res.data);
            return res.data;
        }
    })


    return (
        <div className="md:max-w-7xl mx-auto shadow-xl mt-3">
            <h1>Payment History here {payments.length}</h1>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead className="text-center">
                        <tr>
                            <th>SL</th>
                            <th>Name</th>
                            <th>Paid Amount</th>
                            <th>Payment Status</th>
                            <th>Transaction ID</th>
                            <th>Tracking ID</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {/* row 1 */}
                        {
                            payments.map((payment, index) =>
                                <tr key={payment._id}>
                                    <th>{index + 1}</th>
                                    <td>{payment.parcelName}</td>
                                    <td>${payment.amount}</td>
                                    <td className="text-green-500 capitalize">{payment.paymentStatus}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>{payment.trackingId}</td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;