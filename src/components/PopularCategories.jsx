import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../ui/Container';

import 'swiper/css';
import 'swiper/css/navigation';

// Kategoriyalar üçün məlumatlar
const categories = [
  {
    name: "Headsets",
    productCount: 0,
    imageUrl: "/images/250701160018572691.webp",
    imageAlt: "Qara rəngli qulaqlıq şəkili"
  },
  {
    name: "Motherboards",
    productCount: 0,
    imageUrl: "/images/fwebp.webp",
    imageAlt: "Oyun anakartının şəkili"
  },
  {
    name: "Apple MacBook",
    productCount: 2,
    imageUrl: "/images/1700920103.png",
    imageAlt: "MacBook Pro-nun şəkili"
  },
  {
    name: "Apple iPad",
    productCount: 1,
    imageUrl: "/images/250331120252145280.webp",
    imageAlt: "Apple iPad Pro-nun şəkili"
  },
  {
    name: "Drones",
    productCount: 0,
    imageUrl: "/images/ae5d8b9987be8d5ecdeb5d502a1e887c.png",
    imageAlt: "Kiçik dron şəkili"
  },
  {
    name: "Mirrorless",
    productCount: 0,
    imageUrl: "/images/D12.webp",
    imageAlt: "Rəqəmsal güzgüsüz kamera şəkili"
  },
  {
    name: "Apple iPhone",
    productCount: 1,
    imageUrl: "/images/gamenote_img_76_1702640727.png.webp",
    imageAlt: "iPhone 15 Pro şəkili"
  },
];

// Tək bir kategoriya elementinin komponenti
const CategoryCard = ({ name, productCount, imageUrl, imageAlt }) => (
  <div 
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between p-4 cursor-pointer w-full border border-gray-100 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
    style={{ minHeight: '260px' }}
  >
    {/* Məhsul Şəkili sahəsi */}
    <div className="w-full flex justify-center items-center h-40">
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="object-contain w-36 h-36"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=Image+Error"; 
        }}
      />
    </div>

    {/* Məhsul Məlumatı */}
    <div className="text-center mt-3 w-full">
      <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{name}</h3>
      <p className={`text-sm mt-1 ${productCount > 0 ? 'text-gray-600' : 'text-gray-400'}`}>
        {productCount} product{productCount !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

// Əsas Kateqoriya Bölməsi Komponenti
export default function PopularCategories() {
  return (
    <Container>
      <div className="w-full py-8 sm:py-12 px-4 sm:px-6">
        {/* Başlıq */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 tracking-tight px-2">
          Popular Categories
        </h2>

        {/* Swiper Container with Navigation */}
        <div className="relative group">
          {/* Navigation Buttons - Hidden until hover */}
          <button className="category-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          <button className="category-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            navigation={{
              prevEl: '.category-prev',
              nextEl: '.category-next',
            }}
            breakpoints={{
              // Mobile: 2 slides
              320: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              // Small tablets: 3 slides
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              // Tablets: 4 slides
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              // Large tablets: 5 slides
              1024: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
              // Desktop: 6 slides
              1280: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
              // Large desktop: 7 slides
              1536: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="popular-categories-swiper"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <CategoryCard 
                  name={category.name} 
                  productCount={category.productCount}
                  imageUrl={category.imageUrl}
                  imageAlt={category.imageAlt}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .popular-categories-swiper {
            padding: 8px 4px;
            margin: 0 -4px;
          }
          
          @media (min-width: 640px) {
            .popular-categories-swiper {
              padding: 12px 8px;
              margin: 0 -8px;
            }
          }
          
          @media (min-width: 1024px) {
            .popular-categories-swiper {
              padding: 16px 12px;
              margin: 0 -12px;
            }
          }

          /* Swiper slide styling */
          .popular-categories-swiper .swiper-slide {
            height: auto;
          }

          /* Hide navigation buttons on touch devices when not hovering */
          @media (hover: none) {
            .category-prev,
            .category-next {
              opacity: 0.7 !important;
            }
          }

          /* Ensure smooth transitions */
          .category-prev,
          .category-next {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>
    </Container>
  );
}