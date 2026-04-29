import React from 'react';
import errorImg from "../../assets/danger.gif"

const AdminError = () => {
    return (
        <div className="w-full h-screen">
            <div className='max-w-7xl mx-auto flex items-center justify-center flex-col'>
                <h1 className="font-bold text-6xl py-3">Forbidden Access Request</h1>
                <img src={errorImg} alt="error" className="w-150 h-150" />

                <div className="py-5">
                    <button className="rounded-xl p-4 font-bold bg-secondary text-primary text-xl cursor-pointer" onClick={() => window.history.back()}>Go To Home</button>
                </div>
            </div>
        </div>
    );
};

export default AdminError;