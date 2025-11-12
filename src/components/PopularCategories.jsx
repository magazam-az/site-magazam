import React from 'react';
import Container from '../ui/Container';

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
    className="bg-transparent rounded-xl transition-all duration-300 flex flex-col items-center justify-between p-0 cursor-pointer focus:outline-none group"
    style={{ minHeight: '130px' }}
  >
    {/* Məhsul Şəkili sahəsi */}
    <div className="w-full flex justify-center items-center h-60">
      <div className="bg-white rounded-xl p-2 shadow-lg overflow-hidden">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="object-contain w-[180px] h-[180px] transition-transform duration-300 ease-out group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/6B7280/ffffff?text=Image+Error"; }}
        />
      </div>
    </div>

    {/* Məhsul Məlumatı */}
    <div className="text-center w-full" style={{ marginTop: '-8px' }}>
      <h3 className="text-[18px] font-bold text-gray-900 line-clamp-2">{name}</h3>
      <p className={`text-sm mt-0 font-medium ${productCount > 0 ? 'text-gray-700' : 'text-gray-500'}`}>
        {productCount} product{productCount !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

// Əsas Kateqoriya Bölməsi Komponenti
export default function PopularCategories() {
  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className="w-full">
        {/* Başlıq */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:mb-5 tracking-tight">
          Popular Categories
        </h2>

        {/* Flex Container */}
        <div className="flex flex-wrap justify-between gap-x-6 sm:gap-x-8">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              name={category.name} 
              productCount={category.productCount}
              imageUrl={category.imageUrl}
              imageAlt={category.imageAlt}
            />
          ))}
        </div>
      </div>
      </Container>
    </div>
  );
}