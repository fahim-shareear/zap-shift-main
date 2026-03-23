import React from 'react';
import { useForm, useWatch } from "react-hook-form";
import useClickAnimation from '../custonHooks/useClickAnimation';
import { useLoaderData } from 'react-router';
import Swal from "sweetalert2"
import useAxiosSecure from '../custonHooks/useAxiosSecure';
import useAuth from '../custonHooks/useAuth';

const ParcelForm = () => {
    const { isClicked, enevtHandlers } = useClickAnimation();
    const { handleSubmit, register, control, formState: { errors } } = useForm();
    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [... new Set(regionsDuplicate)];
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });
    const axiosSecure = useAxiosSecure();
    const {user} = useAuth();
    // console.log(user);


    const districtsByRegion = region => {
        if (!region) return [];
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    };


    const handleSendParcel = (data) => {
        const isDocument = data.parcelType === "document";
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight || 0);

        let cost = 0;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        }
        else {
            if (parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150;
            }
            else {
                const minCharge = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

                cost = minCharge + extraCharge;
            }
        }

        // console.log("Cost of the parcel & delivary: ", cost);
        Swal.fire({
            title: "Agree with the Cost?",
            text: `You will be charged. ${cost} taka!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "I agree!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.post("/parcels", data)
                    .then(res =>{
                        console.log("after saving parcel", res.data);
                    }).catch(error =>{
                        console.log("Eror message", error.message);
                    })
                // Swal.fire({
                //     title: "Success!",
                //     text: "Your order has been canceled.",
                //     icon: "success"
                // });
            }
        });
    };

    return (
        <div className="w-full rounded-md my-8 shadow-md text-black grow">
            <div>
                <h1 className="font-bold text-3xl text-primary p-5">Send a Parcel</h1>
            </div>
            <div>
                <h4 className="text-xl p-4 text-semibold text-primary">Enter your parcel details</h4>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleSendParcel)}>
                    {/*parcel type */}
                    <div>
                        <label className='label mr-4' >
                            <input type="radio"
                                value="document"
                                className="radio"
                                defaultChecked
                                {...register('parcelType', { required: true })} />
                            Document
                        </label>

                        <label className='label' >
                            <input type="radio"
                                value="Non-document"
                                className="radio"
                                defaultChecked
                                {...register('parcelType')} />
                            Non-Document
                        </label>
                        {errors.parcelType?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Must select the parcel type.</p>}
                    </div>

                    {/* parcel info: name, weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Name <span className="text-red-500 text-[18px]">*</span></label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Parcel Name"
                                {...register('parcelName', { required: true })} />
                            {errors.parcelName?.type === 'required' && <p className="text-[16px] text-red-500 font-semibold">Parcel Name is required</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Weight (kg) <span className="text-red-500 text-[18px]">*</span></label>
                            <input type="number"
                                className="input w-full"
                                placeholder="Parcel Weight"
                                step="any"
                                {...register('parcelWeight', { required: true })} />
                            {errors.parcelWeight?.type === 'required' && <p className="text-[16px] text-red-500 font-semibold">Parcel Name is required</p>}
                        </fieldset>
                    </div>

                    {/* two column */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-15'>
                        <div>
                            {/* sender info */}
                            <h4 className="text-2xl font-semibold text-primary">Sender Info</h4>
                            <fieldset className="fieldset">
                                <label className="label text-bold text-primary text-[15px]">Sender Name <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender Name"
                                    defaultValue={user?.displayName}
                                    {...register('senderName', { required: true })} />
                                {errors.senderName?.type === "required" && <p className="text-[16px] font-semibold text-red-500">Sender name field can't be empty.</p>}

                                <label className="label text-bold text-primary text-[15px]">Sender Email <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="email"
                                    className="input w-full"
                                    placeholder="Sender email"
                                    defaultValue={user.email}
                                    {...register('senderEmail', { required: true })} />
                                {errors.senderName?.type === "required" && <p className="text-[16px] font-semibold text-red-500">Sender email field can't be empty.</p>}

                                {/* sender address */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Address <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender address"
                                    {...register('senderAddress', { required: true })} />
                                {errors.senderAddress?.type === 'required' && <p className="text-[16px] font-semibold text-red-500">Sender address is a must</p>}

                                {/* sender phone number */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Phone No <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender Phone No"
                                    {...register('senderPhone', { required: true })} />
                                {errors.senderPhone?.type === "required" && <p className='font-semibold text-[16px] text-red-500'>Sender Contact number must be included</p>}


                                {/* sender region */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Region <span className="text-red-500 text-[18px]">*</span></label>
                                <select className="select select-md w-full" defaultValue="" {...register('senderRegion', { required: true })}>
                                    <option value={"Select Region"} >Select Region</option>
                                    {
                                        regions.map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.senderRegion?.type === "required" && <p className="font-semibold text-[16px] text-red-500">Please select your Region</p>}

                                {/* Sender district */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Region <span className="text-red-500 text-[18px]">*</span></label>
                                <select className="select select-md w-full" defaultValue="" {...register('senderDistrict', { required: true })}>
                                    <option value={"Select District"} >Select District</option>
                                    {
                                        districtsByRegion(senderRegion).map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.senderDistrict?.type === "required" && <p className="font-semibold text-[16px] text-red-500">Please select your district</p>}

                                <div className="flex flex-col gap-3">
                                    {/* text aread */}
                                    <label className="label mt-4 text-bold text-primary text-[15px]">Pickup Instructions here <span className="text-red-500 text-[18px]">*</span></label>
                                    <textarea placeholder="Pickup Instructions here" className="w-full textarea textarea-md" {...register('pickupInstruction')}></textarea>
                                </div>
                            </fieldset>
                        </div>


                        <div>
                            {/* receiver info */}

                            <h4 className="text-2xl font-semibold text-primary">Receiver Info</h4>
                            <fieldset className="fieldset">
                                <label className="label text-bold text-primary text-[15px]">Receiver Name <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Receiver Name"
                                    {...register('receiverName', { required: true })} />
                                {errors.receiverName?.type === 'required' && <p className="font-semibold text-[16px] text-red-500">Please enter the recepients name</p>}

                                {/* sender address */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Receiver Address <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Receiver address"
                                    {...register('receiverAddress', { required: true })} />
                                {errors.receiverAddress?.type === "required" && <p className="font-semibold, text-[16px] text-red-500">Receipient's address must be provided</p>}

                                {/* sender phone number */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Receiver Phone No <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Receiver Phone No"
                                    {...register('receiverPhone', { required: true })} />
                                {errors.receiverPhone?.type === 'required' && <p className="text-red-500 text-[16px] font-semibold">Please enter receivers contact number</p>}


                                {/* receiver Regions */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Receiver Region <span className="text-red-500 text-[18px]">*</span></label>
                                <select className="select select-md w-full" defaultValue="" {...register('receiverRegion', { required: true })}>
                                    <option value={"Select Region"} >Select Region</option>
                                    {
                                        regions.map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.receiverRegion?.type === 'required' && <p className='text-[16px] text-red-500 font-semibold'>Please select the receivers Dsitrict</p>}

                                {/* Receiver District */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Receiver District <span className="text-red-500 text-[18px]">*</span></label>
                                <select className="select select-md w-full" defaultValue="" {...register('receiverDistrict', { required: true })}>
                                    <option value={"Select District"} >Select District</option>
                                    {
                                        districtsByRegion(receiverRegion).map((r, index) => (
                                            <option key={index} value={r}>
                                                {r}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.receiverRegion?.type === 'required' && <p className='text-[16px] text-red-500 font-semibold'>Please select the receivers Dsitrict</p>}

                                <div className="flex flex-col gap-3">
                                    {/* text aread */}
                                    <label className="label mt-4 text-bold text-primary text-[15px]">Delivery Instructions here <span className="text-red-500 text-[18px]">*</span></label>
                                    <textarea placeholder="Pickup Instructions here" className="w-full textarea textarea-md" {...register('deliveryInstruction')}></textarea>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <h3 className="font-bold text-[16px] text-red-500 my-3"><span>*</span> Pickup Time 4pm-7pm Approx</h3>
                    <input type="submit"
                        {...enevtHandlers}
                        value="Proceed to confirm Booking"
                        className={`btn btn-secondary text-primary my-3 transition-all duration-150 transform ${isClicked ? "scale-95" : "scale-100"}`}
                    />
                </form>
            </div>
        </div>
    );
};

export default ParcelForm;