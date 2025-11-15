import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import Rating from './Rating';

import 'swiper/css';
import 'swiper/css/navigation';

// Məhsul kartı komponenti
const ProductCard = ({ product }) => (
  <div 
    className="bg-white rounded-xl transition-all duration-300 flex flex-col p-3 sm:p-4 cursor-pointer w-full border border-gray-100 focus:outline-none relative product-card group"
    style={{ 
      minWidth: '100%',
      maxWidth: '100%'
    }}
  >
    {/* HOT badge */}
    {product.isHot && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        HOT
      </div>
    )}
    
    {/* Məhsul Şəkili sahəsi - sabit ölçü */}
    <div className="w-full flex justify-center items-center mb-3 sm:mb-4 overflow-hidden" style={{ height: '200px' }}>
      <img 
        src={product.imageUrl} 
        alt={product.imageAlt} 
        className="object-contain w-full h-full max-w-[180px] max-h-[180px] sm:max-w-[234px] sm:max-h-[234px] transition-transform duration-300 ease-out group-hover:scale-110"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/234x234/6B7280/ffffff?text=Product+Image"; }}
      />
    </div>

    {/* Məhsul Məlumatı - sabit ölçü */}
    <div className="flex flex-col flex-grow text-left">
      <div className="mb-2 sm:mb-3 flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2">{product.name}</h3>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-1 sm:mt-2">{product.brand}</p>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-0.5 sm:mt-1">{product.model}</p>
        <div className="mt-1 sm:mt-2">
          <Rating rating={product.rating || 5} />
        </div>
      </div>
      
      <div className="mt-auto">
        {/* Stok statusu */}
        <div className="flex items-center mb-1 sm:mb-2">
          {product.inStock ? (
            <span className="text-green-600 text-xs sm:text-sm flex items-center">
              <span className="mr-1">✔</span> In stock
            </span>
          ) : (
            <span className="text-red-600 text-xs sm:text-sm">Out of stock</span>
          )}
        </div>
        
        {/* Qiymət */}
        <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3">
          {product.price}
        </div>
        
        {/* Add to Cart button */}
        <button className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 mb-2 cursor-pointer">
          Add To Cart
        </button>
      </div>
    </div>
  </div>
);

// Əsas Products Komponenti
const Products = ({ title = "Products", products = [], showBanner = false, bannerData = null }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className={`w-full ${showBanner ? 'flex flex-col lg:flex-row gap-6' : ''}`}>
        {/* Sol Banner Alanı */}
        {showBanner && bannerData && (
          <div className="w-full lg:w-[32%] flex-shrink-0">
            <div className="promo-banner-wrapper relative overflow-hidden rounded-2xl h-full" style={{ minHeight: showBanner ? '400px' : '500px' }}>
              <div className="promo-banner banner-default banner-hover-zoom color-scheme-light with-btn relative h-full">
                
                {/* Əsas şəkil wrapper */}
                <div className="main-wrapp-img h-full">
                  <div className="banner-image h-full">
                    <img 
                      loading="lazy" 
                      decoding="async"
                      src={bannerData.imageUrl}
                      alt={bannerData.alt || "Banner"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x720/6B7280/ffffff?text=Banner";
                      }}
                    />
                  </div>
                </div>

                {/* Məzmun wrapper */}
                <div className="wrapper-content-banner absolute inset-0 flex items-start justify-center pt-8">
                  <div className="content-banner text-center w-full px-4">
                    
                    {/* Subtitle */}
                    {bannerData.subtitle && (
                      <div className="banner-subtitle subtitle-style-default text-gray-300 text-sm font-medium mb-2 tracking-wide">
                        {bannerData.subtitle}
                      </div>
                    )}
                    
                    {/* Title */}
                    {bannerData.title && (
                      <h4 className="banner-title text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                        {bannerData.title}
                      </h4>
                    )}
                    
                    {/* Button */}
                    {bannerData.buttonText && (
                      <div className="banner-btn-wrapper mt-4">
                        <div className="wd-button-wrapper text-center">
                          <a 
                            href={bannerData.buttonLink || "#"} 
                            className="btn btn-style-default bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 inline-block text-sm cursor-pointer"
                          >
                            <span className="wd-btn-text">
                              {bannerData.buttonText}
                            </span>
                          </a>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Sağ Ürün Alanı */}
        <div className={showBanner ? "w-full lg:w-[68%]" : "w-full"}>
        {/* Başlıq ve More Products Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:mb-5 mb-4 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <button 
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-3xl transition-all duration-200 cursor-pointer hover:shadow-md text-xs sm:text-sm"
            style={{
              backgroundColor: '#E1EBFF',
              borderColor: '#E1EBFF',
              color: '#1C61E7',
              border: '1px solid #E1EBFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D1DBFF';
              e.currentTarget.style.borderColor = '#D1DBFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E1EBFF';
              e.currentTarget.style.borderColor = '#E1EBFF';
            }}
          >
            <span className="text-xs sm:text-sm font-medium">More Products</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1C61E7' }} />
          </button>
        </div>

        {/* Swiper Container with Navigation */}
        <div className="relative slider-container w-full overflow-hidden">
          {/* Navigation Buttons - Hidden until hover */}
          <button 
            className="best-offers-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (swiperInstance) {
                swiperInstance.slidePrev();
              }
            }}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
          
          <button 
            className="best-offers-next absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (swiperInstance) {
                swiperInstance.slideNext();
              }
            }}
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={2}
            watchOverflow={true}
            resistance={false}
            resistanceRatio={0}
            onSwiper={setSwiperInstance}
            breakpoints={{
              // Mobile: 1 slide
              320: {
                slidesPerView: 1,
                spaceBetween: 12,
              },
              // Small tablets: 2 slides (banner yoksa) veya 1 slide (banner varsa)
              640: {
                slidesPerView: showBanner ? 1 : 2,
                spaceBetween: 16,
              },
              // Tablets: 2 slides
              768: {
                slidesPerView: showBanner ? 2 : 2,
                spaceBetween: 20,
              },
              // Large tablets: 4 slides (banner yoksa) veya 3 slides (banner varsa)
              1024: {
                slidesPerView: showBanner ? 3 : 4,
                spaceBetween: 24,
              },
              // Desktop: 4 slides (banner yoksa) veya 3 slides (banner varsa)
              1280: {
                slidesPerView: showBanner ? 3 : 4,
                spaceBetween: 32,
              },
              // Large desktop: 4 slides (banner yoksa) veya 3 slides (banner varsa)
              1536: {
                slidesPerView: showBanner ? 3 : 4,
                spaceBetween: 20,
              },
            }}
            className={`best-offers-swiper w-full ${showBanner ? 'with-banner' : ''}`}
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product.sku || product.id || index}-${index}`}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Styles */}
        <style jsx="true">{`
          .slider-container:hover .best-offers-prev,
          .slider-container:hover .best-offers-next {
            opacity: 1 !important;
          }
          
          .best-offers-swiper {
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            width: 100% !important;
          }
          
          .best-offers-swiper .swiper-wrapper {
            align-items: flex-start;
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
          
          .best-offers-swiper .swiper-slide {
            height: auto;
            display: flex;
            justify-content: flex-start;
            width: auto !important;
            flex-shrink: 0;
          }
          
          .best-offers-swiper .swiper-slide:first-child {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }

          /* Product card specific styling */
          .best-offers-swiper .swiper-slide > div {
            width: 100%;
            max-width: 100%;
            flex-shrink: 0;
          }
          
          
          
          /* Desktop'ta slide genişliğini container'a göre ayarla */
          @media (min-width: 1024px) {
            .best-offers-swiper:not(.with-banner) .swiper-slide {
              width: calc((100% - 96px) / 4) !important;
            }
            .best-offers-swiper.with-banner .swiper-slide {
              width: calc((100% - 64px) / 3) !important;
            }
            .best-offers-swiper .swiper-slide > div {
              max-width: 100% !important;
              width: 100% !important;
            }
          }
          
          @media (min-width: 1280px) {
            .best-offers-swiper:not(.with-banner) .swiper-slide {
              width: calc((100% - 96px) / 4) !important;
            }
            .best-offers-swiper.with-banner .swiper-slide {
              width: calc((100% - 64px) / 3) !important;
            }
            .best-offers-swiper .swiper-slide > div {
              max-width: 100% !important;
              width: 100% !important;
            }
          }

          /* Hide navigation buttons on touch devices when not hovering */
          @media (hover: none) {
            .best-offers-prev,
            .best-offers-next {
              opacity: 0.7 !important;
            }
          }

          /* Ensure smooth transitions */
          .best-offers-prev,
          .best-offers-next {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Banner hover effect */
          .banner-hover-zoom .banner-image img {
            transition: transform 0.3s ease;
          }

          .banner-hover-zoom:hover .banner-image img {
            transform: scale(1.05);
          }
        `}</style>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default Products;

