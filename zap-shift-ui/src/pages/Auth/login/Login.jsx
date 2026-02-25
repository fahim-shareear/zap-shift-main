import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../sociallogin/SocialLogin';

const Login = () => {
    const [eye, setEye] = useState(false);
    const { signInUser } = useAuth();
    const { handleSubmit,
        register,
        formState: { errors } } = useForm();

    const handleEye = e => {
        e.preventDefault();
        setEye(!eye);
    };

    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
            })
            .catch(error => {
                console.log(error);
            })
    };


    return (
        <div className="max-w-4xl p-6 text-center">
            <div>
                <h1 className="font-bold text-4xl p-3">Welcome Back</h1>
                <p className="text-gray-500 font-medium p-3">Login with ZapShift</p>
            </div>
            <form onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset p-4">
                    {/* Email field */}
                    <label className="label text-[16px]">Email</label>
                    <input type="email" className="input w-full rounded-xl" placeholder="Email" {...register("email", { required: true })} />
                    {errors.email?.type === "required" && <p className="text-red-500 font-bold text-medium">Email field is required</p>}
                    {/* Passowrd field */}
                    <div className="relative">
                        <label className="label text-[16px]">Password</label>
                        <input type={eye ? "text" : "password"} className="input w-full rounded-xl" placeholder="Password" {...register("password", {
                            required: true,
                            minLength: 6,
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
                        })} />
                        <button className="absolute top-8 right-4 font-bold text-xl" onClick={handleEye}>
                            {eye ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
                        </button>
                        {errors.password?.type === 'required' && <p className="text-red-500">Password field is required</p>}
                        {errors.password?.type === 'minLength' && <p>Password must be minimum 6 character long</p>}
                        {errors.pattern?.type === 'pattern' && <p>Password must contain one uppercase one lowercase and one special character</p>}
                    </div>
                    {/* Forgot Password  */}
                    <div><a className="link link-hover underline text-[16px] text-gray-400">Forgot password?</a></div>
                    {/* Submit button */}
                    <button className="btn btn-secondary text-black mt-4 rounded-xl">Login</button>
                </fieldset>
            </form>
            <div className="pl-3">
                <h4>Dont't have an account? Please <Link to="/register"><span className="font-bold text-primary">Register</span></Link></h4>
            </div>
            <div>
                <h4 className="font-bold text-xl">Or</h4>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;