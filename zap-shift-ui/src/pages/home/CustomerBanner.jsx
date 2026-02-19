import React from 'react';
import locationMerchant from "../../assets/location-merchant.png";
import beAmerchant from "../../assets/be-a-merchant-bg.png";

const CustomerBanner = () => {
    return (
        /* 1. flex-col (mobile) -> flex-row (desktop)
           2. text-center (mobile) -> text-left (desktop)
           3. items-center: keeps everything vertically aligned in the row
        */
        <div 
            className="bg-primary rounded-3xl bg-contain bg-top bg-no-repeat m-5 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 min-h-87.5"
            style={{ backgroundImage: `url(${beAmerchant})` }}
        >
            {/* Left Side: Content Wrapper */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-white font-bold text-2xl md:text-4xl leading-tight">
                    Merchant and Customer Satisfaction is Our First Priority
                </h1>
                <p className="text-white text-sm md:text-base opacity-90 py-4 md:py-6 max-w-md">
                    We offer the lowest delivery charge with the highest value along with 100% safety of your product. 
                    ZapShift courier delivers your parcels in every corner of Bangladesh right on time.
                </p>
                
                {/* Buttons: flex-wrap ensures they don't break on tiny screens */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pb-8 md:pb-0">
                    <button className="text-primary bg-secondary px-6 py-3 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform">
                        Become a Merchant
                    </button>
                    <button className="border-secondary px-6 py-3 border text-secondary rounded-full font-bold cursor-pointer hover:bg-secondary hover:text-primary transition-colors">
                        Earn With Zap Shift
                    </button>
                </div>
            </div>

            {/* Right Side: Image Wrapper */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <img 
                    src={locationMerchant} 
                    alt="Merchant Location Illustration" 
                    className="w-4/5 md:w-full max-w-112.5 object-contain"
                />
            </div>
        </div>
    );
};

export default CustomerBanner;