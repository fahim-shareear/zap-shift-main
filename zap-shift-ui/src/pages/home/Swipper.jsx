import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Your Brand Imports
import amazon from "../../assets/brands/amazon.png";
import amazonvector from "../../assets/brands/amazon_vector.png";
import casio from "../../assets/brands/casio.png";
import moonstar from "../../assets/brands/moonstar.png";
import randstad from "../../assets/brands/randstad.png";
import star from "../../assets/brands/star.png";
import startPeople from "../../assets/brands/start_people.png";

const Swipper = () => {
  const brandImage = [
    { id: 1, src: amazon, alt: "amazon" },
    { id: 2, src: amazonvector, alt: "amazonvector" },
    { id: 3, src: casio, alt: "casio" },
    { id: 4, src: moonstar, alt: "moonstar" },
    { id: 5, src: randstad, alt: "randstad" },
    { id: 6, src: star, alt: "star" },
    { id: 7, src: startPeople, alt: "startPeople" },
  ];

  return (
    <div className="md:max-w-7xl mx-auto py-10">
      {/* Inline CSS to force linear movement (No stutter) */}
      <style>
        {`
          .mySwiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-bold text-primary md:text-3xl text-xl p-3">
          We've helped thousands of sales teams
        </h1>
      </div>

      <Swiper
        slidesPerView={3}
        spaceBetween={0}
        loop={true}
        /* --- SMOOTH MARQUEE TRANSITION EFFECT --- */
        speed={5000} // Speed of the continuous flow (5 seconds)
        autoplay={{
          delay: 0, // No pause between slides
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Stops when user hovers
        }}
        /* ----------------------------------------- */
        breakpoints={{
          640: { slidesPerView: 3 },
          1080: { slidesPerView: 5 }
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper"
      >
        {brandImage.map((brand) => (
          <SwiperSlide key={brand.id}>
            <div className="flex items-center justify-center p-4">
              <img src={brand.src} alt={brand.alt} className="h-10 object-contain" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Swipper;