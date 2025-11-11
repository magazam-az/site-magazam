import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import '../assets/css/HeroSection.css';

import 'swiper/css';
import 'swiper/css/pagination';

const CountdownBox = ({ value, label }) => (
  <div className=" backdrop-blur-sm rounded-md p-2 w-14 text-center shadow-sm">
    <span className="text-2xl font-bold text-gray-900 block">{value}</span>
    <span className="text-xs uppercase text-gray-600">{label}</span>
  </div>
);

export default function ProductBanners() {
  const slides = [
    {
      id: 1,
      title: "Apple Shopping Event",
      description: "Shop great deals on MacBook, iPad, iPhone and more.",
      buttonText: "Shop Now",
      bgClass: "bg-img"
    },
    {
      id: 2,
      title: "New iPhone 15 Pro",
      description: "Discover the revolutionary titanium design.",
      buttonText: "Learn More",
      bgClass: "bg-img-2"
    },
    {
      id: 3,
      title: "MacBook Air M3",
      description: "Supercharged by the next-generation M3 chip.",
      buttonText: "Buy Now",
      bgClass: "bg-img-3"
    }
  ];

  return (
    <div className=" mx-auto w-full p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Apple Banner with Swiper) --- */}
        <div className="lg:w-[750px]">
          <div className="relative rounded-lg overflow-hidden h-full min-h-[500px]">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                el: '.custom-pagination',
                bulletClass: 'custom-bullet',
                bulletActiveClass: 'custom-bullet-active'
              }}
              loop={true}
              className="h-full"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className={`${slide.bgClass} text-white p-8 md:p-12 rounded-lg h-full flex flex-col justify-between min-h-[500px]`}>
                    <div className="relative z-10">
                      <h2 className="text-3xl md:text-5xl apas mb-5 text-center">
                        {slide.title}
                      </h2>
                      <p className="text-lg text-gray-300 mb-6 text-center">
                        {slide.description}
                      </p>
                      <div className="buton-div flex justify-center items-center">
                        <button className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 px-6 rounded-md transition-colors flex justify-center items-center">
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Dots */}
            <div className="paginations flex justify-center items-center absolute bottom-4 left-0 right-0 z-20">
              <div className="custom-pagination flex gap-2 bg-white rounded-full p-1 shadow-md w-auto px-3"></div>
            </div>
          </div>
        </div>
        
        {/* --- 2. Right Column (contains 3 cards) --- */}
        <div className="lg:flex-1 flex flex-col gap-6">
          
          {/* Card 2.1: Aurora Headset */}
          <div className="relative bg-qulaq p-6 rounded-lg overflow-hidden h-[300px]">
            <div className="absolute top-0 right-0 w-2/3 -mt-8 -mr-8 opacity-80">
              {/* You would place your <img /> tag here */}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mt-7">Aurora Headset</h3>
              <div className="flex gap-2 mb-4">
                <CountdownBox value="52" label="Days" />
                <CountdownBox value="06" label="Hr" />
                <CountdownBox value="33" label="Min" />
                <CountdownBox value="08" label="Sc" />
              </div>
              <button className="bg-[#53426B] hover:bg-[#53426B] text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                Buy Now
              </button>
            </div>
          </div>
          
          {/* Row for the two bottom cards */}
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Card 2.2: New Dual Sense */}
            <div className="bg-ps4 text-white p-6 rounded-lg flex-1 h-[200px]">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <h3 className="text-xl font-bold">New Dual Sense</h3>
                  <p className="text-sm text-blue-100 mb-4">For PlayStation 5</p>
                  <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
                </div>
              </div>
            </div>
            
            {/* Card 2.3: Instant Cameras */}
            <div className="bg-cam text-gray-900 p-6 rounded-lg flex-1">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <h3 className="text-xl font-bold">Instant Cameras</h3>
                  <p className="text-sm text-gray-700 mb-4">Get photo paper as a gift</p>
                  <button className="bg-white text-yellow-800 font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Custom CSS for pagination bullets */}
      <style jsx>{`
        .custom-pagination {
          display: flex !important;
          justify-content: center;
          align-items: center;
          width: auto !important;
          min-width: 80px;
          position: static !important;
          transform: none !important;
          background: white;
          border-radius: 9999px;
          padding: 6px 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .custom-bullet {
          width: 8px;
          height: 8px;
          background-color: #6b7280;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 3px;
        }
        .custom-bullet-active {
          background-color: #5C4977;
          width: 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}