import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetHeroQuery } from '../redux/api/heroApi';
import { Link } from 'react-router-dom';
import Container from './ui/Container';

import '../assets/css/HeroSection.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CountdownBox = ({ value, label }) => (
  <div className="bg-white rounded-md p-1.5 w-12 h-12 text-center shadow-sm flex flex-col items-center justify-center">
    <span className="text-xl font-bold text-gray-700 block leading-tight">{value}</span>
    <span className="text-[9px] uppercase text-gray-500 leading-tight">{label}</span>
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
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Default değerler (hero yoksa veya yükleniyorsa)
  if (isLoading) {
    return (
      <Container>
        <div className="w-full my-5">
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Yüklənir...</div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !hero) {
    return null; // Hero yoksa hiçbir şey gösterme
  }

  const slides = hero.leftSide?.slides || [];
  const rightTop = hero.rightTop || {};
  const bottomBlocks = hero.bottomBlocks || [];

  return (
    <Container>
      <div className="w-full my-5">
        <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Slider) --- */}
        {slides.length > 0 && (
          <div className="lg:w-[680px] w-full">
            <div className="relative rounded-lg overflow-hidden h-full min-h-[420px] group">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
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
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setSwiperInstance(swiper);
                }}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      className="text-white p-6 md:p-10 h-full flex flex-col justify-between min-h-[420px] relative hero-image-zoom-bg"
                      style={{
                        backgroundImage: slide.image?.url ? `url(${slide.image.url})` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    >
                      <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl apas mb-4 text-center">
                          {slide.title}
                        </h2>
                        <p className="text-base text-gray-300 mb-5 text-center">
                          {slide.description}
                        </p>
                        <div className="buton-div flex justify-center items-center">
                          {slide.buttonLink && slide.buttonText && (
                            <Link
                              to={slide.buttonLink}
                              className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 px-6 rounded-md transition-colors flex justify-center items-center text-sm cursor-pointer"
                            >
                              {slide.buttonText}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Pagination Dots */}
              {slides.length > 1 && (
                <div className="paginations flex justify-center items-center absolute bottom-4 left-0 right-0 z-20">
                  <div className="custom-pagination flex gap-2 bg-white rounded-full p-1 shadow-md w-auto px-3"></div>
                </div>
              )}

              {/* Custom Navigation Buttons */}
              {slides.length > 1 && (
                <>
                  <button 
                    className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (swiperInstance) {
                        swiperInstance.slidePrev();
                      }
                    }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button 
                    className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (swiperInstance) {
                        swiperInstance.slideNext();
                      }
                    }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* --- 2. Right Column (contains top card and bottom blocks) --- */}
        <div className="lg:flex-1 flex flex-col gap-6">
          
          {/* Card 2.1: Right Top */}
          {rightTop.image?.url && (
            <div 
              className="relative p-5 rounded-xl overflow-hidden h-[250px] group hero-image-zoom-bg"
              style={{
                backgroundImage: `url(${rightTop.image.url})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="relative z-10 px-1">
                {rightTop.title && (
                  <h3 className="text-[23px] font-bold text-white mt-5 mb-4">{rightTop.title}</h3>
                )}
                <div className="flex gap-2 mb-4">
                  {rightTop.endDate && <CountdownTimer endDate={rightTop.endDate} />}
                </div>
                {rightTop.buttonLink && rightTop.buttonText && (
                  <Link
                    to={rightTop.buttonLink}
                    className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm cursor-pointer"
                  >
                    {rightTop.buttonText}
                  </Link>
                )}
              </div>
            </div>
          )}
          
          {/* Row for the two bottom cards */}
          {bottomBlocks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6">
              {bottomBlocks.slice(0, 2).map((block, index) => (
                <div 
                  key={index}
                  className={`${index === 0 ? 'bg-ps4 text-white' : 'bg-cam text-gray-900'} p-5 rounded-xl flex-1 h-[170px] relative overflow-hidden group hero-image-zoom-bg`}
                  style={{
                    backgroundImage: block.image?.url ? `url(${block.image.url})` : 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="flex items-center justify-between space-x-4 h-full relative z-10">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {block.title && (
                          <h3 className="text-lg font-bold">{block.title}</h3>
                        )}
                        {block.description && (
                          <p className={`text-xs ${index === 0 ? 'text-blue-100' : 'text-gray-700'} mb-3`}>
                            {block.description}
                          </p>
                        )}
                      </div>
                      {block.buttonLink && block.buttonText && (
                        <Link
                          to={block.buttonLink}
                          className={`bg-white ${index === 0 ? 'text-blue-500' : 'text-yellow-800'} font-semibold py-2 px-4 rounded-md text-xs hover:bg-gray-100 transition-colors cursor-pointer`}
                        >
                          {block.buttonText}
                        </Link>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {/* Image placeholder */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for pagination bullets */}
      <style>{`
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
    </Container>
  );
}
