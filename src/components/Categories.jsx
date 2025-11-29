import React from 'react';
import Container from "../components/ui/Container"

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
    className="bg-transparent rounded-xl transition-all duration-300 flex flex-col items-center justify-between p-0 cursor-pointer w-full max-w-[200px] mx-auto group focus:outline-none"
    style={{ minHeight: '200px' }}
  >
    {/* Məhsul Şəkili sahəsi */}
    <div className="w-full aspect-square flex justify-center items-center bg-white">
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="object-contain w-36 h-36 transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=Image+Error"; 
        }}
      />
    </div>

    {/* Məhsul Məlumatı */}
    <div className="text-center mt-2 sm:mt-4 w-full">
      <h3 className="font-bold text-gray-800 line-clamp-2" style={{ fontSize: '19px' }}>{name}</h3>
      <p className={`text-sm mt-1 ${productCount > 0 ? 'text-gray-600' : 'text-gray-400'}`}>
        {productCount} product{productCount !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

// Əsas Kateqoriya Bölməsi Komponenti
export default function Categories() {
  return (
    <Container>
      <div className="w-full py-8 sm:py-12">
        {/* Başlıq */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 tracking-tight text-center sm:text-left">
          Popular Categories
        </h2>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-24px)] xl:w-[calc(16.666%-20px)]"
              style={{ minWidth: '140px', maxWidth: '200px' }}
            >
              <CategoryCard 
                name={category.name} 
                productCount={category.productCount}
                imageUrl={category.imageUrl}
                imageAlt={category.imageAlt}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

