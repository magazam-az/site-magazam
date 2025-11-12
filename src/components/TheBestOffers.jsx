import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../ui/Container';

import 'swiper/css';
import 'swiper/css/navigation';

// Məhsul məlumatları
const products = [
  {
    name: "Acer SA100 SATAIII",
    brand: "SSD Drive",
    model: "Philips",
    type: "SATA 2.5\" Solid State Drive",
    price: "30,00 ₼",
    inStock: true,
    sku: "5334126",
    imageUrl: "/src/assets/images/thebestoffers/acer-sa100-sataiii-1.jpg",
    imageAlt: "Acer SA100 SATA SSD Drive",
    isHot: true
  },
  {
    name: "Alogic Ultra Mini USB",
    brand: "Card Readers",
    model: "ASUS",
    type: "SATA 2.5\" Solid State Drive",
    price: "50,00 ₼",
    inStock: true,
    sku: "5334127",
    imageUrl: "/src/assets/images/thebestoffers/alogic1.jpg",
    imageAlt: "Alogic Ultra Mini USB",
    isHot: true
  },
  {
    name: "AMD Ryzen 5 7600X",
    brand: "Processors",
    model: "HP",
    type: "SATA 2.5\" Solid State Drive",
    price: "299,00 ₼",
    inStock: true,
    sku: "5334128",
    imageUrl: "/src/assets/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
    imageAlt: "AMD Ryzen 5 7600X",
    isHot: true
  },
  {
    name: "Apple iPad Mini 6 Wi-Fi",
    brand: "Apple Ipad",
    model: "Apple",
    type: "SATA 2.5\" Solid State Drive",
    price: "500,00 ₼ – 600,00 ₼",
    inStock: true,
    sku: "5334129",
    imageUrl: "/src/assets/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
    imageAlt: "Apple iPad Mini 6 Wi-Fi",
    isHot: true
  },
  {
    name: "Apple MacBook Pro 16″ M1",
    brand: "Apple MacBook",
    model: "Apple",
    type: "SATA 2.5\" Solid State Drive",
    price: "2.999,00 ₼",
    inStock: true,
    sku: "5334130",
    imageUrl: "/src/assets/images/thebestoffers/apple-macbook-pro-16.jpg",
    imageAlt: "Apple MacBook Pro 16″ M1",
    isHot: true
  }
];

// Məhsul kartı komponenti
const ProductCard = ({ product }) => (
  <div 
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col p-4 cursor-pointer w-full border border-gray-100 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none relative product-card"
    style={{ 
      minHeight: '420px',
      maxHeight: '420px',
      minWidth: '240px',
      maxWidth: '240px'
    }}
  >
    {/* HOT badge */}
    {product.isHot && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        HOT
      </div>
    )}
    
    {/* Məhsul Şəkili sahəsi - sabit ölçü */}
    <div className="w-full flex justify-center items-center mb-4" style={{ height: '160px' }}>
      <img 
        src={product.imageUrl} 
        alt={product.imageAlt} 
        className="object-contain w-full h-full max-w-[140px] max-h-[140px]"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/140x140/6B7280/ffffff?text=Product+Image"; }}
      />
    </div>

    {/* Məhsul Məlumatı - sabit ölçü */}
    <div className="flex flex-col flex-grow text-left" style={{ height: '200px' }}>
      <div className="mb-3 flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">{product.brand}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{product.model}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.type}</p>
      </div>
      
      <div className="mt-auto">
        {/* Stok statusu */}
        <div className="flex items-center mb-2">
          {product.inStock ? (
            <span className="text-green-600 text-sm flex items-center">
              <span className="mr-1">✔</span> In stock
            </span>
          ) : (
            <span className="text-red-600 text-sm">Out of stock</span>
          )}
        </div>
        
        {/* Qiymət */}
        <div className="text-lg font-bold text-[#5C4977] mb-3">
          {product.price}
        </div>
        
        {/* Add to Cart button */}
        <button className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 mb-2">
          Add To Cart
        </button>
        
        {/* SKU */}
        <p className="text-xs text-gray-400 text-center">
          SKU: {product.sku}
        </p>
      </div>
    </div>
  </div>
);

// Əsas Kateqoriya Bölməsi Komponenti
export default function TheBestOffers() {
  return (
    <Container>
      <div className="w-full py-8 sm:py-12 px-4 sm:px-6">
        {/* Başlıq */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 tracking-tight px-2">
          The Best Offers
        </h2>

        {/* Swiper Container with Navigation */}
        <div className="relative group">
          {/* Navigation Buttons - Hidden until hover */}
          <button className="best-offers-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          
          <button className="best-offers-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            navigation={{
              prevEl: '.best-offers-prev',
              nextEl: '.best-offers-next',
            }}
            breakpoints={{
              // Mobile: 2 slides
              320: {
                slidesPerView: 1,
                spaceBetween: 12,
              },
              // Small tablets: 3 slides
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              // Tablets: 4 slides
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              // Large tablets: 5 slides
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              // Desktop: 5 slides (maintain for product cards)
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              // Large desktop: 5 slides (maintain for product cards)
              1536: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
            }}
            className="best-offers-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product.sku}-${index}`}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Styles */}
        <style jsx="true">{`
          .best-offers-swiper {
            padding: 8px 4px;
            margin: 0 -4px;
          }
          
          @media (min-width: 640px) {
            .best-offers-swiper {
              padding: 12px 8px;
              margin: 0 -8px;
            }
          }
          
          @media (min-width: 1024px) {
            .best-offers-swiper {
              padding: 16px 12px;
              margin: 0 -12px;
            }
          }

          /* Swiper slide styling */
          .best-offers-swiper .swiper-slide {
            height: auto;
            display: flex;
            justify-content: center;
          }

          /* Product card specific styling */
          .best-offers-swiper .swiper-slide > div {
            width: 100%;
            max-width: 240px;
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

          /* Custom scrollbar hiding for fallback */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
     </Container>
  );
}