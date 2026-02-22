import React, { useState } from 'react';

const About = () => {
    const [activeTabs, setActiveTabs] = useState("story");
    const tabs = [
        {id: "story", label: "Story"},
        {id: "mission", label: "Mission"},
        {id: "success", label: "Success"},
        {id: "team", label: "Team & Others"},
    ];

    const content = {
        story: "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",

        mission: "Our mission is to make delivery simple, fast, and reliable for everyone. We focus on customer satisfaction and modern technology.",

        success: "We have successfully delivered thousands of packages with high customer satisfaction and reliable service.",

        team: "Our team is made up of skilled and dedicated people who work hard to provide the best service every day.",
    };


    return (
        <div className="mt-25 max-w-5xl mx-auto rounded-xl shadow-xl m-6 h-200">
            <div className="max-w-3xl ml-3">
                <h1 className="font-bold text-primary text-2xl py-3">About Us</h1>
                <p className="text-primary py-4">Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
            </div>

            <div className='border-b mb-6 max-w-4xl mx-auto border-primary'></div>

            {/* tabs */}
            <div className="md:max-w-3xl max-w-2xl py-6 mx-auto">
                {
                    tabs.map((tab) => (
                    <button 
                    key={tab.id}
                    onClick={() => setActiveTabs(tab.id)}
                    className={`pb-2 text-sm mr-5 transition-all duration-300 ease-linear font-bold m-2 ${activeTabs === tab.id ? 'text-green-600 border-b-2 border-green-600 font-semibold' : "text-gray-600"}`}>
                        {tab.label}
                    </button>))
                }

                {/* content */}
                <div className='mt-4 p-4 text-gray-600 leading-relaxed space-y-4 max-w-4xl mx-auto transition-all ease-linear overflow-auto h-95 md:h-full'>
                    <p className="trnasition-all ease-linear font-medium">{content[activeTabs]}</p>
                    <p className="trnasition-all ease-linear font-medium">{content[activeTabs]}</p>
                    <p className="trnasition-all ease-linear font-medium">{content[activeTabs]}</p>
                    <p className="trnasition-all ease-linear font-medium">{content[activeTabs]}</p>
                </div>
            </div>
        </div>
    );
};

export default About;