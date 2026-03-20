import React from 'react';
import { useForm } from "react-hook-form";
import useClickAnimation from '../custonHooks/useClickAnimation';
import { useLoaderData } from 'react-router';

const ParcelForm = () => {
    const { isClicked, enevtHandlers } = useClickAnimation();
    const { handleSubmit, register, formState: { errors } } = useForm();
    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [... new Set(regionsDuplicate)];
    // console.log(regions);
    

    const handleSendParcel = (data) => {
        console.log(data);
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
                                {...register('parcelType', {required: true})} />
                                
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
                                {...register('parcelName', {required: true})} />
                                {errors.parcelName?.type === 'parcelName' && <p className="text-[16px] text-red-500 font-semibold">Parcel Name is required</p>}
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Weight (kg) <span className="text-red-500 text-[18px]">*</span></label>
                            <input type="number"
                                className="input w-full"
                                placeholder="Parcel Weight"
                                {...register('parcelWeight', {required: true})} />
                                {errors.parcelWeigh?.type === 'required' && <p className="text-[16px] text-red-500 font-semibold">Parcel Name is required</p>}
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
                                    {...register('senderName', { required: true })} />
                                    {errors.senderName?.type === "required" && <p className="text-[16px] font-semibold text-red-500">Sender name field can't be empty.</p>}

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
                                    {errors.senderPhone?.type === "senderPhone" && <p className='font-semibold text-[16px] text-red-500'>Sender Contact number must be included</p>}


                                {/* sender district */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Region <span className="text-red-500 text-[18px]">*</span></label>
                                <select defaultValue="" className="select select-md w-full" {...register('senderRegion', { required: true })}>
                                    <option disabled={true}>Select District</option>
                                    {
                                        regions.map((district, index) => (
                                            <option key={index} value={district}>
                                                {district}
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


                                {/* sender district */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Receiver Region <span className="text-red-500 text-[18px]">*</span></label>
                                <select defaultValue="Select Region" className="select select-md w-full" {...register('receiverRegion', { required: true })}>
                                    <option disabled={true}>Select District</option>
                                    {
                                        regions.map((district, index) => (
                                            <option key={index} value={district}>
                                                {district}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.receiverDistrict?.type === 'required' && <p className='text-[16px] text-red-500 font-semibold'>Please select the receivers Dsitrict</p>}

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