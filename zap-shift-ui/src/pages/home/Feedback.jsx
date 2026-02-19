import React, { use } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import customerTop from "../../assets/customer-top.png";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';

const Feedback = ({feedbackPromise}) => {
    const feedBack = use(feedbackPromise);
    console.log(feedBack);
    return (
        <div className="m-5 border border-red-500">
            <div className="flex flex-col items-center">
                <img src={customerTop} alt={customerTop} />
                <h1 className="font-bold text-primary md:text-3xl text-xl">What our customers are saying</h1>
                <p className="p-4">Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
            </div>
            <Swiper>

            </Swiper>
        </div>
    );
};

export default Feedback;