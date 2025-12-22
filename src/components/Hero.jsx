import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useGetHeroQuery } from '../redux/api/heroApi';
import { Link } from 'react-router-dom';

import '../assets/css/HeroSection.css';

import 'swiper/css';
import 'swiper/css/pagination';

const CountdownBox = ({ value, label }) => (
  <div className="backdrop-blur-sm bg-white rounded-md p-2 w-14 text-center shadow-sm">
    <span className="text-2xl font-bold text-gray-900 block">{value}</span>
    <span className="text-xs uppercase text-gray-600">{label}</span>
  </div>
);

// Countdown timer component
const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex gap-2">
      <CountdownBox value={String(timeLeft.days).padStart(2, '0')} label="Days" />
      <CountdownBox value={String(timeLeft.hours).padStart(2, '0')} label="Hr" />
      <CountdownBox value={String(timeLeft.minutes).padStart(2, '0')} label="Min" />
      <CountdownBox value={String(timeLeft.seconds).padStart(2, '0')} label="Sec" />
    </div>
  );
};

export default function ProductBanners() {
  const { data, isLoading, error } = useGetHeroQuery();
  const hero = data?.hero;

  // Default değerler (hero yoksa veya yükleniyorsa)
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Yüklənir...</div>
        </div>
      </div>
    );
  }

  if (error || !hero) {
    return null; // Hero yoksa hiçbir şey gösterme
  }

  const slides = hero.leftSide?.slides || [];
  const rightTop = hero.rightTop || {};
  const bottomBlocks = hero.bottomBlocks || [];

  return (
    // Ana container - mobilde de kenar boşlukları olacak
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Slider) --- */}
        {slides.length > 0 && (
          <div className="lg:w-[750px] w-full">
            <div className="relative rounded-xl overflow-hidden h-full min-h-[500px]">
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
                loop={slides.length > 1}
                className="h-full"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      className="text-white p-6 md:p-12 rounded-xl h-full flex flex-col justify-center items-center min-h-[500px] relative"
                      style={{
                        backgroundImage: slide.image?.url ? `url(${slide.image.url})` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    >
                      {/* Overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/20 z-0"></div>
                      
                      <div className="relative z-10 text-center max-w-2xl">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5">
                          {slide.title}
                        </h2>
                        <p className="text-base md:text-lg text-gray-200 mb-6">
                          {slide.description}
                        </p>
                        {slide.buttonLink && slide.buttonText && (
                          <Link
                            to={slide.buttonLink}
                            className="inline-block bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md transition-colors duration-300 text-sm md:text-base"
                          >
                            {slide.buttonText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Pagination Dots */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 z-20">
                  <div className="flex justify-center">
                    <div className="custom-pagination flex gap-2 bg-white rounded-full p-1 shadow-lg w-auto px-4"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* --- 2. Right Column (contains top card and bottom blocks) --- */}
        <div className="lg:flex-1 flex flex-col gap-6">
          
          {/* Card 2.1: Right Top */}
          {rightTop.image?.url && (
            <div 
              className="relative p-6 rounded-xl overflow-hidden h-[300px]"
              style={{
                backgroundImage: `url(${rightTop.image.url})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                {rightTop.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-white">{rightTop.title}</h3>
                )}
                <div>
                  {rightTop.endDate && <CountdownTimer endDate={rightTop.endDate} />}
                  {rightTop.buttonLink && rightTop.buttonText && (
                    <Link
                      to={rightTop.buttonLink}
                      className="mt-4 inline-block bg-[#53426B] hover:bg-[#53426B]/90 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300 text-sm md:text-base"
                    >
                      {rightTop.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Row for the two bottom cards */}
          {bottomBlocks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6">
              {bottomBlocks.slice(0, 2).map((block, index) => (
                <div 
                  key={index}
                  className="text-white p-6 rounded-xl flex-1 min-h-[200px] relative overflow-hidden"
                  style={{
                    backgroundImage: block.image?.url ? `url(${block.image.url})` : 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1">
                      {block.title && (
                        <h3 className="text-lg md:text-xl font-bold mb-2">{block.title}</h3>
                      )}
                      {block.description && (
                        <p className="text-sm mb-4 opacity-90">{block.description}</p>
                      )}
                      {block.buttonLink && block.buttonText && (
                        <Link
                          to={block.buttonLink}
                          className="inline-block bg-white text-[#5C4977] hover:bg-gray-100 font-semibold py-2 px-4 md:px-5 rounded-md text-sm transition-colors duration-300"
                        >
                          {block.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          padding: 6px 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-bullet {
          width: 8px;
          height: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 4px;
          opacity: 0.7;
        }
        .custom-bullet-active {
          background-color: #5C4977;
          width: 24px;
          border-radius: 6px;
          opacity: 1;
        }
        .custom-bullet:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
