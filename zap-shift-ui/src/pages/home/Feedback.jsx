import React, { use } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import ReviewCard from '../shared/ReviewCard';
import customerTop from "../../assets/customer-top.png";
import 'swiper/css/navigation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const Feedback = ({ feedbackPromise }) => {
    // Ensure this component is wrapped in <Suspense> where it is called
    const feedBack = use(feedbackPromise);

    return (
        <div className="py-10 bg-gray-50">
            <div className="flex flex-col items-center text-center mb-10">
                <img src={customerTop} alt="Customer section icon" className="mb-4" />
                <h1 className="font-bold text-primary md:text-4xl text-2xl">What our customers are saying</h1>
                <p className="p-4 max-w-2xl text-gray-600">
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro.
                </p>
            </div>

            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                autoplay={{
                    duraton: 3000
                }}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                className="mySwiper"
            >
                {
                    feedBack.map(review => <SwiperSlide key={review._id} className="w-75! md:w-100!">
                        <ReviewCard review={review}></ReviewCard>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
    );
};

export default Feedback;