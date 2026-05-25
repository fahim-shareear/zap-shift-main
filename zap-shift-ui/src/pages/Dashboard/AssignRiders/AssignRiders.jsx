import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../custonHooks/useAxiosSecure';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';


const AssignRiders = () => {
    const axiosSecure = useAxiosSecure();
    const riderModalRef = useRef();
    const [selectedParcel, setSelectedParcel] = useState(null);

    const { data: parcels = [], refetch: parcelRefetch } = useQuery({
        queryKey: ['parcels', 'pending-pickup'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels?deliveryStatus=parcel-paid')
            // console.log(res.data);
            return res.data
        }
    });

    const { data: riders = [] } = useQuery({
        queryKey: ['riders', selectedParcel?.senderDistrict, 'available'],
        enabled: !!selectedParcel,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?status=approved&workStatus=available&district=${selectedParcel.senderDistrict}`);
            return res.data;
        }
    })


    const handleModal = parcel => {
        setSelectedParcel(parcel);
        riderModalRef.current.showModal();
    };

    const handleAssignRider = rider => {

        const riderAssignInfo = {
            riderId: rider._id,
            riderEmail: rider.riderEmail,
            riderName: rider.riderName,
            parcelId: selectedParcel._id,
            trackingId: selectedParcel.trackingId
        };

        axiosSecure.patch(`/parcels/${selectedParcel._id}`, riderAssignInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    riderModalRef.current.close();
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You want to assign this rider?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Asign Rider!"
                    }).then((result) => {
                        if (result.isConfirmed) Swal.fire({
                            title: "Success!",
                            text: "Your rider has been assigned.",
                            icon: "success"
                        });
                        parcelRefetch();
                    });
                }
            })
    }


    return (
        <div>
            <h1>Assign Parcels: {parcels.length}</h1>
            <div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Created At</th>
                                <th>Parcel Type</th>
                                <th>Parcel Weight</th>
                                <th>Parcel Price</th>
                                <th>Pickup Location District</th>
                                <th>Sender Address</th>
                                <th>Sender Email</th>
                                <th>Receiver Name</th>
                                <th>Receiver Address</th>
                                <th>Receiver Contact Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parcels.map((parcel, index) => <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                                    <td>{parcel.parcelType}</td>
                                    <td>{parcel.parcelWeight}</td>
                                    <td>{parcel.cost}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td>{parcel.senderAddress}</td>
                                    <td>{parcel.senderEmail}</td>
                                    <td>{parcel.receiverName}</td>
                                    <td>{parcel.receiverAddress}</td>
                                    <td>{parcel.receiverPhone}</td>
                                    <td>
                                        <button
                                            onClick={() => handleModal(parcel)}
                                            className="btn btn-secondary text-primary">Assign Rider</button>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <dialog ref={riderModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg py-2">Available Riders: {riders.length}</h3>
                    <div>
                        <div>
                            {riders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {riders.map((rider, index) => (
                                                <tr key={rider._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle h-12 w-12">
                                                                    <img
                                                                        src={rider.riderImage}
                                                                        alt={rider.riderName} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{rider.riderName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{rider.riderEmail}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleAssignRider(rider)}
                                                            className="btn bg-secondary text-primary">
                                                            Assign
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500">No available riders</p>
                            )}
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignRiders;