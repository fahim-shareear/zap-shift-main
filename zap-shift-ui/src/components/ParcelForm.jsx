import React from 'react';
import { useForm } from "react-hook-form";

const ParcelForm = () => {
    const { handleSubmit, register, formState: { errors } } = useForm();

    const handleSendParcel = (data) => {
        console.log(data);
    }

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
                                {...register('parcelType')} />
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
                    </div>

                    {/* parcel info: name, weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Name</label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Parcel Name"
                                {...register('parcelName')} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Weight (kg)</label>
                            <input type="number"
                                className="input w-full"
                                placeholder="Parcel Weight"
                                {...register('parcelWeight')} />
                        </fieldset>
                    </div>

                    {/* two column */}
                    <div>
                        {/* sender info */}

                        <h4 className="text-2xl font-semibold text-primary">Sender Info</h4>
                        <fieldset className="fieldset">
                            <label className="label text-bold text-primary text-[15px]">Sender Name</label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Sender Name"
                                {...register('senderName')} />

                            {/* sender address */}
                            <label className="label mt-4 text-bold text-primary text-[15px]">Sender Address</label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Sender address"
                                {...register('senderAddress')} />

                            {/* sender phone number */}
                            <label className="label mt-4 text-bold text-primary text-[15px]">Sender Phone No</label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Sender Phone No"
                                {...register('senderPhone')} />
                        </fieldset>


                        {/* receiver info */}
                        <div></div>
                    </div>

                    <input type="submit" className="btn btn-secondary text-primary my-3" value="Submit" />
                </form>
            </div>
        </div>
    );
};

export default ParcelForm;