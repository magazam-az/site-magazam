import { Package, Loader2 } from "lucide-react";
import '../assets/css/Thumbnail.css';
import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from "../components/ui/Container"
import Product from './Product';
import { useGetCategoriesQuery } from "../redux/api/categoryApi";
import { useGetHomeAppliancesQuery } from "../redux/api/homeAppliancesApi";
import { useGetProductsQuery } from "../redux/api/productsApi";

import 'swiper/css';
import 'swiper/css/navigation';

export default function Accessory({ accessoryData }) {
  const { data: categoriesDataFromApi } = useGetCategoriesQuery();
  const { data: homeAppliancesData, isLoading: isLoadingHomeAppliances } = useGetHomeAppliancesQuery();
  const { data: productsData } = useGetProductsQuery();
  const allProducts = productsData?.products || [];
  
  // Default values if accessoryData is not provided
  const title = accessoryData?.title || "Microsoft Accessories";
  const description = accessoryData?.description || "Personalize your Surface Pro with Microsoft branded accessories. In the presence of many colors for every taste.";
  const heroImage = accessoryData?.heroImage?.url || accessoryData?.heroImage || "/images/microsoft-accessories.jpg";
  const selectedCategoryIds = accessoryData?.selectedCategories || [];
  const selectedProductIds = accessoryData?.selectedProducts || [];
  const badgeText = accessoryData?.badgeText || "";
  const badgeColor = accessoryData?.badgeColor || "#FF0000";
  const cards = accessoryData?.cards || [];

  // Get all categories and filter selected ones
  const allCategories = categoriesDataFromApi?.categories || [];
  const selectedCategories = useMemo(() => {
    return allCategories.filter(cat => 
      selectedCategoryIds.includes(cat._id) || 
      selectedCategoryIds.includes(cat._id?.toString())
    );
  }, [allCategories, selectedCategoryIds]);

  // Selected products məlumatlarını hazırla
  const selectedProductsList = useMemo(() => {
    if (!selectedProductIds || selectedProductIds.length === 0) {
      return [];
    }
    
    // allProducts-dan selectedProductIds-ə uyğun məhsulları tap
    return allProducts
      .filter(product => {
        const productId = product._id?.toString();
        return selectedProductIds.includes(productId) || selectedProductIds.includes(product._id);
      })
      .map((product) => ({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        price: typeof product.price === 'number' 
          ? product.price 
          : parseFloat(product.price) || 0,
        inStock: (product.stock !== undefined && product.stock > 0) || product.inStock !== false,
        stock: product.stock,
        imageUrl: product.images?.[0]?.url || product.image || "",
        imageAlt: product.name || "Product Image",
        rating: product.ratings || product.rating || 5,
        sku: product.sku || product._id?.substring(0, 7),
      }));
  }, [allProducts, selectedProductIds]);

  // Home Appliances məlumatlarını hazırla (fallback olaraq)
  const homeAppliances = homeAppliancesData?.homeAppliances;
  const hotLabel = homeAppliances?.hotLabel || "Hot";
  
  // Məhsulları Product komponentinə uyğun formata çevir - əvvəlcə selectedProducts-i yoxla
  const homeAppliancesProducts = useMemo(() => {
    // Əgər selectedProducts varsa, onu istifadə et, yoxsa homeAppliances-i istifadə et
    if (selectedProductsList.length > 0) {
      return selectedProductsList;
    }
    
    if (!homeAppliances || !homeAppliances.isActive || !homeAppliances.selectedProductIds) {
      return [];
    }
    
    return homeAppliances.selectedProductIds.map((product) => ({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: typeof product.price === 'number' 
        ? product.price 
        : parseFloat(product.price) || 0,
      inStock: (product.stock !== undefined && product.stock > 0) || product.inStock !== false,
      stock: product.stock,
      imageUrl: product.images?.[0]?.url || product.image || "",
      imageAlt: product.name || "Product Image",
      isHot: true, // HomeAppliances-də bütün məhsullar "Hot" olaraq göstərilir
      hotLabel: hotLabel, // Hot label-i məhsula əlavə et
      rating: product.ratings || product.rating || 5,
      sku: product.sku || product._id?.substring(0, 7),
    }));
  }, [selectedProductsList, homeAppliances, hotLabel]);

  return (
    <div className="w-full py-4 sm:py-6">
      <Container>
      <div className="w-full">
        {/* Üst Bölüm: Hero ve Swiper Yan Yana */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8 xl:items-stretch">
          {/* Microsoft Accessories - 3/4 genişlik */}
          <div className="xl:col-span-3 flex flex-col">
            {/* Microsoft Accessories Section */}
            <section className="bg-white rounded-2xl py-12 lg:pr-6 px-2 md:mb-2 flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center h-full">
                {/* Sol: Şəkil */}
                <div className="relative flex items-center justify-center mx-auto md:mx-0">
                  <img
                    src={heroImage}
                    alt={title}
                    className="w-full h-auto max-w-md rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/microsoft-accessories.jpg";
                    }}
                  />
                </div>

                {/* Sağ: Məzmun */}
                <div className="space-y-3 sm:space-y-4 md:space-y-5 text-center md:text-left pb-0">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Kateqoriya düymələri */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-2.5 pt-2 sm:pt-3 pb-0">
                      {selectedCategories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/catalog/${category.slug || category.name}`}
                          className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3 Kart Section - Microsoft Accessories div'inin içine taşındı */}
            {cards.length > 0 && (
              <section className="pt-5 md:-mt-2 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cards.map((card, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br h-[170px] rounded-2xl p-6 text-white relative h-56 flex flex-col justify-between hover:shadow-lg transition-shadow"
                      style={{
                        backgroundImage: card.backgroundImage?.url ? `url(${card.backgroundImage.url})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {card.backgroundImage?.url && (
                        <div className="absolute inset-0 rounded-2xl"></div>
                      )}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">{card.title || ""}</h3>
                        <p className="text-sm opacity-90">{card.description || ""}</p>
                      </div>
                      {card.buttonText && (
                        <Link
                          to={card.buttonLink || "#"}
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold w-fit px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer relative z-10"
                        >
                          {card.buttonText}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Swiper Kart - 1/4 genişlik */}
          <div className="xl:col-span-1 flex">
            <section className="bg-white rounded-2xl p-4 sm:p-6 w-full flex flex-col h-full">
              <div className="w-full flex flex-col flex-1 min-h-0">
                {/* Başlıq */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                  Home Appliance
                </h2>

                {/* Swiper Container with Navigation */}
                <div className="relative group flex-1">
                  {/* Navigation Buttons */}
                  <button 
                    className="product-prev absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  <button 
                    className="product-next absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Swiper */}
                  {isLoadingHomeAppliances ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <Loader2 className="h-6 w-6 text-[#5C4977] animate-spin" />
                    </div>
                  ) : homeAppliancesProducts.length > 0 ? (
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={12}
                      slidesPerView={1}
                      navigation={{
                        prevEl: '.product-prev',
                        nextEl: '.product-next',
                      }}
                      className="product-swiper"
                      style={{
                        padding: '8px 0',
                        height: '100%'
                      }}
                    >
                      {homeAppliancesProducts.map((product) => (
                        <SwiperSlide key={product._id}>
                          <Product product={product} badgeText={badgeText} badgeColor={badgeColor} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-sm">
                      {selectedProductsList.length === 0 && homeAppliances && !homeAppliances.isActive 
                        ? "Home Appliances deaktivdir" 
                        : "Məhsul tapılmadı"}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
}

