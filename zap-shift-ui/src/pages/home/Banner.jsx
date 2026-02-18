import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowCircleRight } from 'react-icons/fa';

// Images (keep your imports as they are)
import bannerImg1 from '../../assets/banner/banner1.png';
import bannerImg2 from '../../assets/banner/banner2.png';
import bannerImg3 from '../../assets/banner/banner3.png';

const Banner = () => {
    const images = [bannerImg1, bannerImg2, bannerImg3];

    return (
        <Carousel 
            autoPlay={true} 
            interval={3000} 
            infiniteLoop={true} 
            emulateTouch={true}
            showStatus={false}
            showThumbs={false}
            className='mt-5 rounded-xl overflow-hidden'
        >
            {images.map((img, index) => (
                <div key={index} className="relative h-75 md:h-125 lg:h-150">
                    {/* Object-cover ensures the image fills the area without stretching */}
                    <img 
                        src={img} 
                        className="h-full w-full object-cover" 
                        alt={`banner-${index}`} 
                    />
                    
                    {/* Overlay: Centered on mobile, Left-aligned on Desktop */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:items-start md:justify-end md:pb-20 md:pl-20">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button className="bg-secondary text-primary rounded-full px-4 py-3 flex items-center justify-center cursor-pointer font-bold text-sm md:text-xl transition-transform hover:scale-105">
                                Track Your Parcel 
                                <span className="ml-3 text-2xl md:text-3xl -rotate-45 text-primary">
                                    <FaArrowCircleRight />
                                </span>
                            </button>
                            
                            <button className="text-sm md:text-xl font-semibold rounded-md px-6 py-2 cursor-pointer border border-white bg-white/10 text-primary backdrop-blur-sm hover:bg-white hover:text-black transition-all">
                                Be a Rider
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default Banner;