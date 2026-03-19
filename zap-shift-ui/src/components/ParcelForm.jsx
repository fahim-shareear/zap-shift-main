import React from 'react';
import { useForm } from "react-hook-form";
import useClickAnimation from '../custonHooks/useClickAnimation';

const ParcelForm = () => {
    const { isClicked, enevtHandlers } = useClickAnimation();
    const { handleSubmit, register, formState: { errors } } = useForm();
    const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon"
];

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
                            <label className="label text-[15px]">Parcel Name <span className="text-red-500 text-[18px]">*</span></label>
                            <input type="text"
                                className="input w-full"
                                placeholder="Parcel Name"
                                {...register('parcelName')} />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label text-[15px]">Parcel Weight (kg) <span className="text-red-500 text-[18px]">*</span></label>
                            <input type="number"
                                className="input w-full"
                                placeholder="Parcel Weight"
                                {...register('parcelWeight')} />
                        </fieldset>
                    </div>

                    {/* two column */}
                    <div>
                        <div>
                            {/* sender info */}

                            <h4 className="text-2xl font-semibold text-primary">Sender Info <span className="text-red-500 text-[18px]">*</span></h4>
                            <fieldset className="fieldset">
                                <label className="label text-bold text-primary text-[15px]">Sender Name <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender Name"
                                    {...register('senderName')} />

                                {/* sender address */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Address <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender address"
                                    {...register('senderAddress')} />

                                {/* sender phone number */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender Phone No <span className="text-red-500 text-[18px]">*</span></label>
                                <input type="text"
                                    className="input w-full"
                                    placeholder="Sender Phone No"
                                    {...register('senderPhone')} />


                                {/* sender district */}
                                <label className="label mt-4 text-bold text-primary text-[15px]">Sender District <span className="text-red-500 text-[18px]">*</span></label>
                                <select defaultValue="Medium" className="select select-md w-full" {...register('senderDistrict')}>
                                    <option disabled={true}>Select District</option>
                                    {
                                        districts.map((district, index) => (
                                            <option key={index} value={district}>
                                                {district}
                                            </option>
                                        ))
                                    }
                                </select>
                            </fieldset>
                        </div>


                        {/* receiver info */}
                        <div></div>
                    </div>

                    <input type="submit"
                        {...enevtHandlers}
                        className={`btn btn-secondary text-primary my-3 value="Submit transition-all duration-150 transform ${isClicked ? "scale-95" : "scale-100"}`} />
                </form>
            </div>
        </div>
    );
};

export default ParcelForm;