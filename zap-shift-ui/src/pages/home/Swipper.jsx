import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import amazon from "../../assets/brands/amazon.png";
import amazonvector from "../../assets/brands/amazon_vector.png";
import casio from "../../assets/brands/casio.png";
import moonstar from "../../assets/brands/moonstar.png";
import randstad from "../../assets/brands/randstad.png";
import star from "../../assets/brands/star.png";
import startPeople from "../../assets/brands/start_people.png";
// import './styles.css';

const Swipper = () => {
    const brandImage = [
        {id: 1, src: amazon, alt: "amazon"},
        {id: 2, src: amazonvector, alt: "amazonvector"},
        {id: 3, src: casio, alt: "casio"},
        {id: 4, src: moonstar, alt: "moonstar"},
        {id: 5, src: randstad, alt: "randstad"},
        {id: 6, src: star, alt: "star"},
        {id: 6, src: startPeople, alt: "startPeople"},
    ]
    return (
        <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </>
    );
};

export default Swipper;