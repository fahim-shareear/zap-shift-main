import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import bannerImg1 from '../../assets/banner/banner1.png';
import bannerImg2 from '../../assets/banner/banner2.png';
import bannerImg3 from '../../assets/banner/banner3.png';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowCircleRight } from 'react-icons/fa';

const Banner = () => {
    return (
        <Carousel autoPlay={true} interval={3000} infiniteLoop={true} className='mt-5' emulateTouch={true}>
            <div className="relative">
                <img src={bannerImg1} />
                <div className="flex itens-center justify-center gap-4 absolute left-20 bottom-25">
                    <button className="bg-secondary rounded-full p-3 flex items-center justify-center cursor-pointer font-bold text-xl">Track Your Percel <span className="ml-3 text-3xl -rotate-45"><FaArrowCircleRight></FaArrowCircleRight></span></button>
                    <button className="text-xl font-semibold rounded-md p-2 cursor-pointer border border-gray-400">Be a Rider</button>
                </div>
            </div>

            <div className="relative">
                <img src={bannerImg2} />
                <div className="flex itens-center justify-center gap-4 absolute left-20 bottom-25">
                    <button className="bg-secondary rounded-full p-3 flex items-center justify-center cursor-pointer font-bold text-xl">Track Your Percel <span className="ml-3 text-3xl -rotate-45"><FaArrowCircleRight></FaArrowCircleRight></span></button>
                    <button className="text-xl font-semibold rounded-md p-2 cursor-pointer border border-gray-400">Be a Rider</button>
                </div>
            </div>

            <div className="relative">
                <img src={bannerImg3} />
                <div className="flex itens-center justify-center gap-4 absolute left-20 bottom-25">
                    <button className="bg-secondary rounded-full p-3 flex items-center justify-center cursor-pointer font-bold text-xl">Track Your Percel <span className="ml-3 text-3xl -rotate-45"><FaArrowCircleRight></FaArrowCircleRight></span></button>
                    <button className="text-xl font-semibold rounded-md p-2 cursor-pointer border border-gray-400">Be a Rider</button>
                </div>
            </div>
        </Carousel>
    );
};

export default Banner;