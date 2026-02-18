import React from 'react';
import service from "../../assets/service.png"

const OurServices = () => {
    const services = [
        {id: 1, title: "Express  & Standard Delivery", desc: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.", },
        {id: 2, title: "Nationwide Delivery", desc: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.", },
        {id: 3, title: "Fulfillment Solution", desc: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.", },
        {id: 4, title: "Cash on Home Delivery", desc: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.", },
        {id: 5, title: "Corporate Service / Contract In Logistics", desc: "Customized corporate services which includes warehouse and inventory management support.", },
        {id: 6, title: "Parcel Return", desc: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.", },
    ];

    return (
        <div className="bg-primary rounded-xl m-4">
            <div className="title text-center md:py-4 max-w-4xl mx-auto py-4 ">
                <h1 className="font-bold md:text-3xl text-2xl text-white">Our Services</h1>
                <p className="text-white wrap px-3">Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments - we deliver on time, every time.</p>
            </div>

            <div className="p-5">
                <div className="card grid grid-cols-1 md:grid-cols-3 gap-4 mx-w-7xl mx-auto lg:px-20 py-5">
                    {services.map((item) => (
                        <div key={item.id}
                        className="px-3 py-3 shadow-md bg-white rounded-md flex items-center justify-center flex-col text-center
                        transition-all duration-400 hover:bg-secondary hover:scale-105">
                            <div>
                                <img src={service} alt="servicelogo" />
                            </div>
                            <h2 className="text-primary font-bold p-3">{item.title}</h2>
                            <p className="font-medium opacity-90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurServices;