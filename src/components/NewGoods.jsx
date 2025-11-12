import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      minHeight: '480px',
      maxHeight: '480px',
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
    
    {/* Məhsul Şəkili sahəsi - artırılmış ölçü */}
    <div className="w-full flex justify-center items-center mb-4" style={{ height: '220px' }}>
      <img 
        src={product.imageUrl} 
        alt={product.imageAlt} 
        className="object-contain w-full h-full max-w-[200px] max-h-[200px]"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "https://placehold.co/200x200/6B7280/ffffff?text=Product+Image"; 
        }}
      />
    </div>

    {/* Məhsul Məlumatı */}
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
export default function NewGoods() {
  const bannerImageUrl = "https://metashop.az/wp-content/uploads/2023/01/nothing-phone-1.jpg";

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sol Banner Alanı */}
        <div className="w-full lg:w-[32%] flex-shrink-0 hidden lg:block">
          <div className="promo-banner-wrapper relative overflow-hidden rounded-2xl h-full" style={{ minHeight: '500px' }}>
            <div className="promo-banner banner-default banner-hover-zoom color-scheme-light with-btn relative h-full">
              
              {/* Əsas şəkil wrapper */}
              <div className="main-wrapp-img h-full">
                <div className="banner-image h-full">
                  <img 
                    loading="lazy" 
                    decoding="async"
                    src={bannerImageUrl}
                    alt="Nothing Phone 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x720/6B7280/ffffff?text=Nothing+Phone+1";
                    }}
                  />
                </div>
              </div>

              {/* Məzmun wrapper */}
              <div className="wrapper-content-banner absolute inset-0 flex items-start justify-center pt-8">
                <div className="content-banner text-center w-full px-4">
                  
                  {/* Subtitle */}
                  <div className="banner-subtitle subtitle-style-default text-gray-300 text-sm font-medium mb-2 tracking-wide">
                    AT A GOOD PRICE
                  </div>
                  
                  {/* Title */}
                  <h4 className="banner-title text-3xl font-bold text-white mb-6">
                    Nothing Phone 1
                  </h4>
                  
                  {/* Button */}
                  <div className="banner-btn-wrapper mt-4">
                    <div className="wd-button-wrapper text-center">
                      <a 
                        href="#" 
                        className="btn btn-style-default bg-[#5C4977] hover:bg-[#5C4977]/90 text-white py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 inline-block text-sm"
                      >
                        <span className="wd-btn-text">
                          Buy Now
                        </span>
                      </a>
                    </div>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sağ Ürün Alanı */}
        <div className="w-full lg:w-[68%]">
          <h2 className="text-2xl pl-2.5 font-bold text-gray-900 mb-6 tracking-tight">
            New Goods
          </h2>

          {/* Swiper Container with Navigation */}
          <div className="relative group">
            {/* Navigation Buttons */}
            <button className="new-goods-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button className="new-goods-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Swiper */}
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation={{
                prevEl: '.new-goods-prev',
                nextEl: '.new-goods-next',
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 12,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="new-goods-swiper"
            >
              {products.map((product, index) => (
                <SwiperSlide key={`${product.sku}-${index}`}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx="true">{`
        .new-goods-swiper {
          padding: 12px 4px;
          margin: 0 -4px;
        }

        .new-goods-swiper .swiper-slide {
          height: auto;
          display: flex;
          justify-content: center;
        }

        .new-goods-swiper .swiper-slide > div {
          width: 100%;
          max-width: 240px;
        }

        @media (hover: none) {
          .new-goods-prev,
          .new-goods-next {
            opacity: 0.7 !important;
          }
        }

        .new-goods-prev,
        .new-goods-next {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Banner hover effect */
        .banner-hover-zoom .banner-image img {
          transition: transform 0.3s ease;
        }

        .banner-hover-zoom:hover .banner-image img {
          transform: scale(1.05);
        }

        /* Line clamp utility classes */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}