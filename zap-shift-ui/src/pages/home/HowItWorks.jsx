import React from 'react';
import { CiDeliveryTruck } from "react-icons/ci";

const HowItWorks = () => {
    return (
        <div className="my-4">
            <div>
                <h1 className="text-3xl font-bold text-left mt-10 ml-2 text-primary">How It Works</h1>
            </div>
            <div className="mx-auto p-3">
                <div className="card grid gap-4 lg:grid-cols-4 sm:grid-rows-1 mx-auto">
                    <div className="card-body rounded-xl shadow-xl flex items-left flex-col gap-4">
                        <CiDeliveryTruck className="text-primary text-4xl " />
                        <h1 className="font-bold text-lg text-primary">Booking Pickup & Drop</h1>
                        <p className="text-left font-semibold">
                            From personal packages to business shipments we deliver on time, every time.
                        </p>
                    </div>

                    <div className="card-body   rounded-xl shadow-xl flex items-left flex-col gap-4">
                        <CiDeliveryTruck className="text-primary text-4xl " />
                        <h1 className="font-bold text-lg text-primary">Cash on Delivery</h1>
                        <p className="text-left font-semibold">
                            From personal packages to business shipments — we deliver on time, every time.
                        </p>
                    </div>

                    <div className="card-body   rounded-xl shadow-xl flex items-left flex-col gap-4">
                        <CiDeliveryTruck className="text-primary text-4xl " />
                        <h1 className="font-bold text-lg text-primary">Delivery Hub</h1>
                        <p className="text-left font-semibold">
                            From personal packages to business shipments — we deliver on time, every time.
                        </p>
                    </div>

                    <div className="card-body   rounded-xl shadow-xl flex items-left flex-col gap-4">
                        <CiDeliveryTruck className="text-primary text-4xl " />
                        <h1 className="font-bold text-lg text-primary">Booking SME & Corporate</h1>
                        <p className="text-left font-semibold">
                            From personal packages to business shipments — we deliver on time, every time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;