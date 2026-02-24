import React, { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [eye, setEye] = useState(false);
    const { register,
        handleSubmit,
        formState: { errors } } = useForm();

    const handleRegister = (data) => {
        console.log(data);
    };

    const handleEye = (e) =>{
        e.preventDefault();
        setEye(!eye);
    }

    return (
        <div className="max-w-4xl p-6">
            <div>
                <h1 className="font-bold text-4xl p-3">Create an Account</h1>
                <p className="text-gray-500 font-medium p-3">Register with ZapShift</p>
            </div>
            <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset p-3">
                    {/* Name field */}
                    <label className="label font-bold">Name</label>
                    <input type="text" className="input w-full" placeholder="Your Name Here" {...register("name", { required: true, maxLength: 20 })} />
                    {errors.name?.type === "required" && <p className='text-red-500'>Name is required</p>}
                    {/* email field */}
                    <label className="label font-bold">Email</label>
                    <input type="email" className="input w-full" placeholder="Email" {...register("email", { required: true })} />
                    {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}
                    
                    <div className='relative'>
                        {/* Pasword Field */}
                        <label className="label font-bold">Password</label>
                        <input type={eye ? "text" : "password"} className="input text-[16px] w-full" placeholder="Password" {...register("password", { required: true, minLength: 6 }, { pattern: /^[A-Za-z]+$/i })} />
                        <button className="absolute top-7 text-xl right-4" onClick={handleEye}>{eye ? <FaEyeSlash className="trnasition-all duration-150 ease-linear"></FaEyeSlash> : <FaEye></FaEye>}</button>
                        {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 character or longer</p>}
                        {errors.password?.type === 'pattern' && <p className="text-red-500">Password must contain one capital letter one small letter</p>}
                    </div>

                    <button className="btn btn-secondary text-black mt-4">Register</button>
                </fieldset>
            </form>
            <div className="pl-3">
                <h4>Already have an account? <Link to="/login"><span className="font-bold text-primary">Login</span></Link></h4>
            </div>
        </div>
    );
};

export default Register;