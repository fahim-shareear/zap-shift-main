import React from 'react';
import liveTracking from "../../assets/live-tracking.png"
import selfDevlivery from "../../assets/safe-delivery.png"

const Desclaimer = () => {
    const image = [
        { id: 1, src: liveTracking, alt: liveTracking, title: "Live Parcel Tracking", desc: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind." },

        { id: 2, src: selfDevlivery, alt: selfDevlivery, title: "100% Safe Delivery", desc: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time." },

        { id: 3, src: selfDevlivery, alt: selfDevlivery, title: "24/7 Call Center Support", desc: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us." },
    ];


    return (
        <div className="border-t-2 border-dotted border-primary m-5">
            <div className="grid grid-rows-3 gap-5">
                {
                    image.map(im => (
                        <div key={im.id}
                        className="flex items-center justify-start shadow-lg rounded-xl max-w-4xl mx-auto p-4 m-3 bg-white">
                            <div className="w-1/3 flex justify-center shirnk-0">
                                <img src={im.src} alt={im.alt} className="object-cover" />
                            </div>
                            <hr className="border border-dashed border-primary h-40 m-3" />
                            <div className="flex-1">
                                <h4 className="font-bold text-primary p-4 text-xl">{im.title}</h4>
                                <p className="font-medium text-primary p-4">{im.desc}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Desclaimer;