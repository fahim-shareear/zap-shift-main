import React from 'react';
import agentPending from "../assets/agent-pending.png";
import { useLoaderData, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import useAxiosSecure from '../custonHooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const RiderForm = () => {
    const serviceCenters = useLoaderData();
    const { handleSubmit,
        register,
        reset,
        control,
        formState: { errors } } = useForm();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [... new Set(regionsDuplicate)];
    const senderRegion = useWatch({ control, name: 'riderRegion' });
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();


    const districtsByRegion = region => {
        if (!region) return [];
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    };

    const handleRiderApplication = data => {
        // console.log(data);
        const riderData = {
            ...data,
            riderImage: user?.photoURL
        }
        axiosSecure.post('/riders', riderData)
            .then(res => {
                if (res.data.insertedId) {

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your application has been submitted. We will reach out to you within 14 days.",
                        showConfirmButton: false,
                        timer: 2500
                    });

                    reset();

                    navigate('/');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    toast.error("You have already applied. Please await for further instructions.");
                };

                reset();
            });
    };



    return (
        <div className="md:max-w-7xl mx-auto m-30 shadow-xl rounded-xl">
            <div className="grow md:max-w-5xl mx-auto m-10 flex flex-col-reverse md:flex-row items-center justify-between">
                <div className="w-1/2">
                    <div>
                        <div className="title">
                            <h1 className='font-bold text-primary text-4xl md:mb-3'>Be a Rider</h1>
                            <p className="text-[14px] mb-5 text-sm">
                                Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments we deliver on time, every time.
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(handleRiderApplication)} className="mb-10">
                        <h1 className='text-3xl font-bold text-primary mb-5'>Tell us about yourself</h1>
                        <fieldset className="fieldset">
                            <label className="label font-bold text-primary text-[18px]">Your Name: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Your full name" defaultValue={user.displayName} {...register('riderName', { required: true })} />
                            {errors.riderName?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Please Input your full name.</p>}

                            <label className="label font-bold text-primary text-[18px]">Driving License Number: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Driving License Number" {...register('drivingLicenseNumer', { required: true })} />
                            {errors.drivingLicenseNumer?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Your must provide your Driving License Number.</p>}


                            <label className="label font-bold text-primary text-[18px]">Your Email: <span className="text-red-500">*</span></label>
                            <input type="email" className="input w-full" placeholder="Your Email" defaultValue={user.email} {...register('riderEmail', { required: true })} />
                            {errors.riderEmail?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Please provide your Email.</p>}

                            {/*region */}
                            <label className="label mt-4 font-bold text-primary text-[18px]">Your Region: <span className="text-red-500 text-[18px]">*</span></label>
                            <select className="select select-md w-full" defaultValue="" {...register('riderRegion', { required: true })}>
                                <option value={"Select Region"} >Select Region</option>
                                {
                                    regions.map((r, index) => (
                                        <option key={index} value={r}>
                                            {r}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.riderRegion?.type === "required" && <p className="font-semibold text-[16px] text-red-500">Please select your Region</p>}

                            {/* district */}
                            <label className="label mt-4 font-bold text-primary text-[18px]">Your District: <span className="text-red-500 text-[18px]">*</span></label>
                            <select className="select select-md w-full" defaultValue="" {...register('district', { required: true })}>
                                <option value={"Select District"} >Select District</option>
                                {
                                    districtsByRegion(senderRegion).map((r, index) => (
                                        <option key={index} value={r}>
                                            {r}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.district?.type === "required" && <p className="font-semibold text-[16px] text-red-500">Please select your district</p>}


                            <label className="label font-bold text-primary text-[18px]">NID No: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Your NID Number" {...register('riderNIDnumber', { required: true })} />
                            {errors.riderNIDnumber?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Your must provide your NID Number.</p>}

                            <label className="label font-bold text-primary text-[18px]">Phone Number: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Phone Number" {...register('riderPhoneNumber', { required: true })} />
                            {errors.riderPhoneNumber?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Please Provide your Phone Number.</p>}

                            <label className="label font-bold text-primary text-[18px]">Bike Brand Model and Year: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Bike Brand Model and Year" {...register('riderBikeInfo', { required: true })} />
                            {errors.parcelType?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Must select the parcel type.</p>}

                            <label className="label font-bold text-primary text-[18px]">Bike Registration Number: <span className="text-red-500">*</span></label>
                            <input type="text" className="input w-full" placeholder="Bike Registration Number" {...register('riderBikeRegistrationNumber', { required: true })} />
                            {errors.riderBikeInfo?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Please provide your Bike's Model & Brand Name.</p>}


                            <label className="label font-bold text-primary text-[18px]">Tell us about Yourself: <span className="text-red-500">*</span></label>
                            <textarea className="textarea w-full" placeholder="Bio" {...register('riderBio', { required: true })}></textarea>
                            {errors.riderBio?.type === 'required' && <p className='text-[16px] text-red-500 font-semi-bold'>Please tell us about yourself.</p>}

                            <button className="btn btn-secondary mt-4 text-primary">Submit</button>
                        </fieldset>
                    </form>
                </div>
                <div>
                    <img src={agentPending} alt={agentPending} />
                </div>
            </div>
        </div>
    );
};

export default RiderForm;