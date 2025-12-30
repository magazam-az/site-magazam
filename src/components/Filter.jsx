// src/pages/Filter.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Check, Shuffle, Search, Heart, Filter as FilterIcon, X, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import {
  useFilterProductsQuery,
  useGetProductsQuery,
} from "../redux/api/productsApi";
import { useGetCategoriesQuery } from "../redux/api/categoryApi";
import { useGetSpecsQuery } from "../redux/api/specApi";
import { useGetBrandsQuery } from "../redux/api/brandApi";
import { toast } from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "./ui/Breadcrumb";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Product from "./Product";
import { CategoryCard } from "./Categories";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Navigation, Pagination } from 'swiper/modules';

/*---------------------- PRODUCT CARD ----------------------*/
const ProductCard = ({ mehsul }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productImageUrl =
    mehsul?.images && mehsul.images.length > 0
      ? mehsul.images[0]?.url
      : mehsul?.image ||
        "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";

  const inStockText =
    mehsul?.stock === 0 || mehsul?.stockStatus === "out_of_stock"
      ? "Out of stock"
      : "In stock";

  const priceText =
    typeof mehsul?.price === "number"
      ? `${mehsul.price.toFixed(2)} ₼`
      : `${mehsul?.price || "1.299,00 ₼ – 1.499,00 ₼"}`;

  const skuText = mehsul?._id?.substring(0, 7) || mehsul?.sku || "30880";

  return (
    <div
      className="relative w-[225px] h-[532px] bg-white rounded-lg p-4 transition-shadow duration-300 hover:shadow-lg hover:border-[#5C4977]/20 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* NEW Badge */}
      <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
        NEW
      </span>

      {/* Action Icons - hoverda görünür */}
      <div
        className={`absolute top-4 right-4 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
          <Shuffle className="w-4 h-4 text-[#5C4977]" />
        </button>
        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
          <Search className="w-4 h-4 text-[#5C4977]" />
        </button>
        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
          <Heart className="w-4 h-4 text-[#5C4977]" />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${mehsul?.slug || mehsul?._id}`}
        className="flex items-center justify-center h-[140px] mt-4 mb-4"
      >
        <img
          src={productImageUrl}
          alt={mehsul?.name || "Product image"}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";
          }}
        />
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <Link to={`/product/${mehsul?.slug || mehsul?._id}`}>
          <h3 className="font-semibold text-[#5C4977] text-sm line-clamp-2 hover:text-[#5C4977]/80 transition-colors">
            {mehsul?.name || 'Apple MacBook Pro 13" M2'}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-1">
          {mehsul?.category || "Apple MacBook"}
        </p>
        <p className="text-gray-400 text-sm line-clamp-1">
          {mehsul?.brand || "Apple"}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-1 text-gray-700 text-sm pt-1">
          <Check className={`w-4 h-4 ${mehsul?.stock > 0 ? 'text-green-600' : 'text-red-500'}`} />
          <span className={mehsul?.stock > 0 ? 'text-green-600' : 'text-red-500'}>
            {inStockText}
          </span>
        </div>
      </div>

      {/* Price and Color Options */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-[#5C4977] font-medium text-sm font-semibold">{priceText}</div>
        <div className="flex gap-1">
          <span className="w-4 h-4 rounded-full bg-gray-300 border border-gray-200"></span>
          <span className="w-4 h-4 rounded-full bg-gray-500 border border-gray-200"></span>
        </div>
      </div>

      {/* Select Options Button */}
      <button className="w-full mt-4 bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md shadow-[#5C4977]/20">
        Select Options
      </button>

      {/* SKU */}
      <p className="text-gray-400 text-xs mt-3">
        SKU: <span className="text-gray-500">{skuText}</span>
      </p>

      {/* Additional Info - visible on hover */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isHovered ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-400 text-xs">
          Color: <span className="text-gray-500">Silver, Space Gray</span>
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Size: <span className="text-gray-500">155×312.6x221x2 mm</span>
        </p>
      </div>
    </div>
  );
};

/*---------------------- Button Component ----------------------*/
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2";
  const variants = {
    primary: "bg-[#5C4977] text-white hover:bg-[#5C4977]/90 shadow-lg shadow-[#5C4977]/20",
    outline: "border border-[#5C4977]/30 bg-white text-[#5C4977] hover:bg-[#5C4977]/5 hover:border-[#5C4977]/50",
    ghost: "text-[#5C4977] hover:bg-[#5C4977]/10",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/*---------------------- Range Slider Component ----------------------*/
const RangeSlider = ({ min, max, valueMin, valueMax, onChangeMin, onChangeMax }) => {
  const sliderRef = useRef(null);
  const handleWidth = 20; // Handle genişliği (w-5 = 20px)
  
  // Clamp values to ensure valid range
  const clampedValueMin = Math.max(min, Math.min(valueMax, valueMin));
  const clampedValueMax = Math.max(valueMin, Math.min(max, valueMax));
  
  const minPercentage = ((clampedValueMin - min) / (max - min)) * 100;
  const maxPercentage = ((clampedValueMax - min) / (max - min)) * 100;
  
  // Calculate minimum gap (1% of range)
  const minGap = (max - min) * 0.01;

  const getSliderWidth = () => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      return rect.width - 25; // Subtract padding (10px left + 15px right)
    }
    return 300; // Fallback width
  };

  const getValueFromX = (clientX) => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderLeft = rect.left + 10; // Account for left padding
    const sliderWidth = rect.width - 25; // Account for padding
    const percentage = Math.max(0, Math.min(1, (clientX - sliderLeft) / sliderWidth));
    return min + (percentage * (max - min));
  };

  return (
    <div className="relative pt-4">
      <div 
        ref={sliderRef}
        className="relative w-full h-5" 
        style={{ paddingLeft: '10px', paddingRight: '15px' }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2">
          <div
            className="absolute top-0 h-full bg-[#5C4977] rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${Math.max(0, maxPercentage - minPercentage)}%`,
            }}
          />
        </div>
        
        {/* Min handle */}
        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-[#5C4977] rounded-full shadow transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer z-10 touch-none"
          style={{ 
            left: `calc(${minPercentage}% - 10px)`,
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startValue = clampedValueMin;

            const handleMouseMove = (moveEvent) => {
              const newValue = getValueFromX(moveEvent.clientX);
              // Ensure min doesn't exceed max - minGap
              const maxAllowedValue = clampedValueMax - minGap;
              const constrainedValue = Math.max(min, Math.min(maxAllowedValue, newValue));
              onChangeMin(Math.round(constrainedValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startValue = clampedValueMin;

            const handleTouchMove = (moveEvent) => {
              moveEvent.preventDefault();
              if (moveEvent.touches.length === 0) return;
              const touch = moveEvent.touches[0];
              const newValue = getValueFromX(touch.clientX);
              // Ensure min doesn't exceed max - minGap
              const maxAllowedValue = clampedValueMax - minGap;
              const constrainedValue = Math.max(min, Math.min(maxAllowedValue, newValue));
              onChangeMin(Math.round(constrainedValue));
            };

            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
          }}
        />

        {/* Max handle */}
        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-[#5C4977] rounded-full shadow transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer z-10 touch-none"
          style={{ 
            left: `calc(${maxPercentage}% - 10px)`,
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startValue = clampedValueMax;

            const handleMouseMove = (moveEvent) => {
              const newValue = getValueFromX(moveEvent.clientX);
              // Ensure max doesn't go below min + minGap
              const minAllowedValue = clampedValueMin + minGap;
              const constrainedValue = Math.max(minAllowedValue, Math.min(max, newValue));
              onChangeMax(Math.round(constrainedValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startValue = clampedValueMax;

            const handleTouchMove = (moveEvent) => {
              moveEvent.preventDefault();
              if (moveEvent.touches.length === 0) return;
              const touch = moveEvent.touches[0];
              const newValue = getValueFromX(touch.clientX);
              // Ensure max doesn't go below min + minGap
              const minAllowedValue = clampedValueMin + minGap;
              const constrainedValue = Math.max(minAllowedValue, Math.min(max, newValue));
              onChangeMax(Math.round(constrainedValue));
            };

            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
          }}
        />
      </div>

      {/* Labels - show range bounds */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min.toLocaleString()} ₼</span>
        <span>{max.toLocaleString()} ₼</span>
      </div>
      
      {/* Current values */}
      <div className="flex justify-between text-sm font-semibold text-[#5C4977] mt-1">
        <span>{clampedValueMin.toLocaleString()} ₼</span>
        <span>{clampedValueMax.toLocaleString()} ₼</span>
      </div>
    </div>
  );
};

/*---------------------- Helper: specs fieldini obyektə çevir ----------------------*/
const normalizeProductSpecs = (specsField) => {
  if (!specsField) return null;

  // Əgər artıq obyektdirsə (Map-dən gələn plain object)
  if (typeof specsField === "object" && !Array.isArray(specsField)) {
    return specsField;
  }

  // DB-dən String kimi gəlirsə: "{\"id\":\"val\"}"
  if (typeof specsField === "string") {
    try {
      const parsed = JSON.parse(specsField);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (e) {
      return null;
    }
  }

  return null;
};

/*---------------------- Responsive Subcategory Grid ----------------------*/
const SubcategoryGrid = ({ subcategories, categorySlug }) => {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {subcategories.map((sub) => {
        return (
          <div
            key={sub._id || sub.name}
            className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-24px)] xl:w-[calc(16.666%-20px)]"
            style={{ minWidth: "140px", maxWidth: "200px" }}
          >
            <CategoryCard
              name={sub.name}
              slug={sub.slug}
              productCount={sub.productCount}
              imageUrl={sub.imageUrl || "https://placehold.co/150x150/6B7280/ffffff?text=No+Image"}
              imageAlt={`${sub.name} alt kateqoriyası`}
              categorySlug={categorySlug}
              productText="məhsul"
            />
          </div>
        );
      })}
    </div>
  );
};

/*---------------------- Subcategory Slider Component ----------------------*/
const SubcategorySlider = ({ subcategories, categorySlug }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && swiperInstance) {
        const container = containerRef.current;
        const slides = container.querySelectorAll('.swiper-slide');
        let totalWidth = 0;
        
        slides.forEach(slide => {
          totalWidth += slide.offsetWidth + 20; // + gap
        });
        
        const containerWidth = container.offsetWidth;
        
        // Sadece kaydırma yapılabilecek kadar içerik varsa butonları göster
        setShowNavigation(totalWidth > containerWidth + 50); // 50px tolerans
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Swiper hazır olduğunda kontrol et
    if (swiperInstance) {
      swiperInstance.on('init', checkOverflow);
      swiperInstance.on('resize', checkOverflow);
    }

    return () => {
      window.removeEventListener('resize', checkOverflow);
      if (swiperInstance) {
        swiperInstance.off('init', checkOverflow);
        swiperInstance.off('resize', checkOverflow);
      }
    };
  }, [swiperInstance]);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (subcategories.length === 0) return null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Navigation Buttons - sadece gerekli olduğunda göster */}
      {showNavigation && (
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10 pointer-events-none">
          <div className="max-w-[1400px] mx-auto px-4 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={isBeginning}
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors ${
                isBeginning ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-[#5C4977]" />
            </button>
            <button
              onClick={handleNext}
              disabled={isEnd}
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors ${
                isEnd ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-[#5C4977]" />
            </button>
          </div>
        </div>
      )}

      {/* Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        slidesPerGroup={2}
        breakpoints={{
          640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
          },
          1280: {
            slidesPerView: 6,
            slidesPerGroup: 6,
          },
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        className="pb-6"
        style={{ 
          paddingLeft: showNavigation ? '0' : '0',
          paddingRight: showNavigation ? '0' : '0'
        }}
      >
        {subcategories.map((sub) => {
          return (
            <SwiperSlide key={sub._id || sub.name}>
              <div className="flex-shrink-0 w-full h-full" style={{ minWidth: "140px", maxWidth: "200px" }}>
                <CategoryCard
                  name={sub.name}
                  slug={sub.slug}
                  productCount={sub.productCount}
                  imageUrl={sub.imageUrl || "https://placehold.co/150x150/6B7280/ffffff?text=No+Image"}
                  imageAlt={`${sub.name} alt kateqoriyası`}
                  categorySlug={categorySlug}
                  productText="məhsul"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Dots Indicator (Pagination) - sadece gerekli olduğunda göster */}
      {showNavigation && subcategories.length > 6 && (
        <div className="flex justify-center mt-2 space-x-1">
          {Array.from({ length: Math.ceil(subcategories.length / 6) }).map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#5C4977]/50 transition-colors"
              onClick={() => {
                if (swiperInstance) {
                  swiperInstance.slideTo(index * 6);
                }
              }}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/*---------------------- Custom Breadcrumb Component ----------------------*/
const CustomBreadcrumb = ({ items }) => {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === items.length - 1 ? (
              // Sonuncu item - qara rəng və böyük font
              <span className="text-black font-semibold text-lg">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-[#5C4977] transition-colors text-base"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/*---------------------- Main Filter Component ----------------------*/
const Filter = () => {
  const navigate = useNavigate();
  const { category: categorySlugParam, subcategory: subcategorySlugParam } = useParams();

  // Kategoriyalar
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Specs
  const { data: specsData } = useGetSpecsQuery();
  const specs = specsData?.specs || [];

  // Brands
  const { data: brandsData } = useGetBrandsQuery();
  const brands = brandsData?.brands || [];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(3000);
  const [debouncedPriceMin, setDebouncedPriceMin] = useState(0);
  const [debouncedPriceMax, setDebouncedPriceMax] = useState(3000);
  const [selectedPricePreset, setSelectedPricePreset] = useState("");
  const [inputPriceMin, setInputPriceMin] = useState("");
  const [inputPriceMax, setInputPriceMax] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Yeni: Stock status filteri
  const [stockStatus, setStockStatus] = useState(""); // "in_stock", "out_of_stock" və ya ""
  // Xüsusiyyətlər üçün state - { specId: [selectedValues] } formatında (array)
  const [selectedSpecs, setSelectedSpecs] = useState({});

  // URL-dən slug-a görə category/subcategory tap
  useEffect(() => {
    if (categorySlugParam) {
      const category = categories.find((cat) => cat.slug === categorySlugParam);
      if (category) {
        setSelectedCategory(category.name);

        if (subcategorySlugParam) {
          const subcategory = category.subcategories?.find(
            (sub) => sub.slug === subcategorySlugParam
          );
          if (subcategory) {
            setSelectedSubcategory(subcategory.name);
          } else {
            setSelectedSubcategory("");
          }
        } else {
          setSelectedSubcategory("");
        }
      } else {
        setSelectedCategory("");
        setSelectedSubcategory("");
      }
    } else {
      setSelectedCategory("");
      setSelectedSubcategory("");
    }
    setSelectedBrand("");
    setSelectedBrands([]);
  }, [categorySlugParam, subcategorySlugParam, categories]);

  // Bütün məhsullar
  const { data: allProductsData } = useGetProductsQuery();
  const allProducts = allProductsData?.products || [];

  // Dinamik maksimum fiyat hesabla - tüm mehsullardan en yüksek fiyat
  const dynamicMaxPrice = useMemo(() => {
    if (allProducts.length === 0) return 3000; // Varsayılan değer
    
    const prices = allProducts
      .map((p) => p.price)
      .filter((p) => p && typeof p === "number" && p > 0);
    
    if (prices.length === 0) return 3000;
    
    const maxPrice = Math.max(...prices);
    // Yuvarlaqlaşdır (yuvarlaqlama 100-ə)
    return Math.ceil(maxPrice / 100) * 100;
  }, [allProducts]);

  // Dinamik max fiyat değiştiğinde priceMax'i güncelle (sadece varsayılan değerde ise)
  useEffect(() => {
    if (dynamicMaxPrice > 0) {
      // Sadece priceMax varsayılan değerde (3000) veya daha büyükse güncelle
      // Kullanıcı manuel olarak değiştirmişse dokunma
      setPriceMax((prevMax) => {
        // Eğer önceki değer 3000 ise (varsayılan) veya dynamicMaxPrice'tan büyükse güncelle
        if (prevMax >= 3000 || prevMax > dynamicMaxPrice) {
          return dynamicMaxPrice;
        }
        return prevMax;
      });
    }
  }, [dynamicMaxPrice]);

  // Debounce price değişiklikleri - API request'ini geciktir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceMin(priceMin);
      setDebouncedPriceMax(priceMax);
    }, 500); // 500ms bekle

    return () => clearTimeout(timer);
  }, [priceMin, priceMax]);

  // Backend filter query
  const filterQuery = useMemo(() => {
    const query = {};

    if (selectedCategory) query.category = selectedCategory;
    if (selectedSubcategory) query.subcategory = selectedSubcategory;

    // Brand filter
    if (selectedBrands.length > 0) {
      query.brands = selectedBrands;
    } else if (selectedBrand) {
      query.brand = selectedBrand;
    }

    if (debouncedPriceMin > 0) query.minPrice = debouncedPriceMin;
    if (debouncedPriceMax < dynamicMaxPrice) query.maxPrice = debouncedPriceMax;
    if (searchTerm) query.search = searchTerm;
    if (sort) query.sort = sort;

    // Stock status filter
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }

    // Spec filter → selectedSpecs object-dən array-ə çevir
    // Format: { specId: [values] } -> ["specId:value1", "specId:value2"]
    const specFilters = [];
    Object.entries(selectedSpecs).forEach(([specId, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => {
          if (value && value !== "") {
            specFilters.push(`${specId}:${value}`);
          }
        });
      } else if (values && values !== "") {
        specFilters.push(`${specId}:${values}`);
      }
    });
    if (specFilters.length > 0) query.specs = specFilters;

    if (selectedSizes.length > 0) query.sizes = selectedSizes;

    return query;
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    selectedBrands,
    debouncedPriceMin,
    debouncedPriceMax,
    searchTerm,
    sort,
    stockStatus,
    selectedSpecs,
    selectedSizes,
    dynamicMaxPrice,
  ]);

  const { data, error, isError, isLoading, isFetching } = useFilterProductsQuery(filterQuery);

  useEffect(() => {
    if (isError) {
      console.error(error);
      toast.error(error?.data?.message || "Bir xəta baş verdi!");
    }
  }, [isError, error]);

  // Mobilde filtre açıkken body scroll'unu engelle
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  const products = data?.products || [];

  // Active filterləri saymaq üçün
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (stockStatus) count++;
    if (Object.keys(selectedSpecs).length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (selectedSizes.length > 0) count++;
    if (debouncedPriceMin > 0 || debouncedPriceMax < dynamicMaxPrice) count++;
    return count;
  }, [stockStatus, selectedSpecs, selectedBrands, selectedSizes, debouncedPriceMin, debouncedPriceMax, dynamicMaxPrice]);

  // Stock status options (dinamik)
  const stockOptions = useMemo(() => {
    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      return true;
    });

    const inStockCount = filteredProducts.filter((p) => p.stock > 0).length;
    const outOfStockCount = filteredProducts.filter((p) => p.stock === 0).length;

    return [
      {
        value: "in_stock",
        label: "Stokda var",
        count: inStockCount,
        disabled: inStockCount === 0,
      },
      {
        value: "out_of_stock",
        label: "Stokda yoxdur",
        count: outOfStockCount,
        disabled: outOfStockCount === 0,
      },
    ];
  }, [allProducts, selectedCategory, selectedSubcategory]);

  // Brand options - yalnız cari səhifədəki məhsullara əsaslanır
  // Seçilmiş brendləri nəzərə almadan hesablanır (circular dependency qarşısını almaq üçün)
  const brandOptionsQuery = useMemo(() => {
    const query = {};
    if (selectedCategory) query.category = selectedCategory;
    if (selectedSubcategory) query.subcategory = selectedSubcategory;
    if (debouncedPriceMin > 0) query.minPrice = debouncedPriceMin;
    if (debouncedPriceMax < dynamicMaxPrice) query.maxPrice = debouncedPriceMax;
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }
    // selectedSpecs object-dən array-ə çevir
    const specFilters = Object.entries(selectedSpecs)
      .filter(([specId, value]) => value && value !== "")
      .map(([specId, value]) => `${specId}:${value}`);
    if (specFilters.length > 0) query.specs = specFilters;
    // selectedBrands-i buraya əlavə etmirik - circular dependency qarşısını almaq üçün
    return query;
  }, [selectedCategory, selectedSubcategory, debouncedPriceMin, debouncedPriceMax, stockStatus, selectedSpecs, dynamicMaxPrice]);

  const { data: brandOptionsData } = useFilterProductsQuery(brandOptionsQuery);
  const productsForBrandOptions = brandOptionsData?.products || [];

  const brandOptions = useMemo(() => {
    if (!brands.length || productsForBrandOptions.length === 0) return [];

    return brands
      .map((brand) => {
        const count = productsForBrandOptions.filter((p) => p.brand === brand.name).length;
        return {
          id: brand._id,
          name: brand.name,
          count,
          disabled: count === 0,
        };
      })
      .filter((b) => b.count > 0); // Yalnız count > 0 olanları göstər
  }, [brands, productsForBrandOptions]);

  // Spec options - yalnız cari səhifədəki məhsullara əsaslanır
  // Seçilmiş xüsusiyyətləri nəzərə almadan hesablanır (circular dependency qarşısını almaq üçün)
  const specOptionsQuery = useMemo(() => {
    const query = {};
    if (selectedCategory) query.category = selectedCategory;
    if (selectedSubcategory) query.subcategory = selectedSubcategory;
    if (selectedBrands.length > 0) {
      query.brands = selectedBrands;
    } else if (selectedBrand) {
      query.brand = selectedBrand;
    }
    if (debouncedPriceMin > 0) query.minPrice = debouncedPriceMin;
    if (debouncedPriceMax < dynamicMaxPrice) query.maxPrice = debouncedPriceMax;
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }
    // selectedSpecs-i buraya əlavə etmirik - circular dependency qarşısını almaq üçün
    return query;
  }, [selectedCategory, selectedSubcategory, selectedBrand, selectedBrands, debouncedPriceMin, debouncedPriceMax, stockStatus, dynamicMaxPrice]);

  const { data: specOptionsData } = useFilterProductsQuery(specOptionsQuery);
  const productsForSpecOptions = specOptionsData?.products || [];

  // Dinamik xüsusiyyət seçimləri - məhsullardan götürülür
  const dynamicSpecOptions = useMemo(() => {
    if (!specs.length || productsForSpecOptions.length === 0) return [];

    // Yalnız isFilterable: true və status: true olan xüsusiyyətləri göstər
    const filterableSpecs = specs.filter(
      (spec) => spec.isFilterable === true && spec.status === true
    );

    return filterableSpecs.map((spec) => {
      // Məhsullardan bu xüsusiyyət üçün bütün dəyərləri topla
      // Name-ə görə unique et (value-ya görə deyil)
      const allValuesMap = new Map(); // { name: value } formatında
      const numberValues = [];

      productsForSpecOptions.forEach((product) => {
        const specsObj = normalizeProductSpecs(product.specs);
        if (!specsObj) return;

        // Spec name-ə görə dəyərləri tap
        const specName = spec.name || spec.title;
        if (specsObj[specName]) {
          const values = Array.isArray(specsObj[specName])
            ? specsObj[specName]
            : [specsObj[specName]];

          values.forEach((val) => {
            if (val && typeof val === "object" && val.name !== undefined) {
              // Name və value var
              const itemName = String(val.name).trim();
              const itemValue = val.value !== undefined ? val.value : val;
              
              // Name-ə görə unique et (eyni name varsa, value-ni saxla)
              if (!allValuesMap.has(itemName)) {
                allValuesMap.set(itemName, itemValue);
              }
              
              if (spec.type === "number") {
                const numValue = typeof itemValue === "number" ? itemValue : parseFloat(itemValue);
                if (!isNaN(numValue)) {
                  numberValues.push({ name: itemName, value: numValue });
                }
              }
            } else if (val && typeof val === "object" && val.value !== undefined) {
              // Yalnız value var, name yoxdur - value-nu name kimi istifadə et
              const value = val.value;
              const valueStr = String(value).trim();
              
              if (!allValuesMap.has(valueStr)) {
                allValuesMap.set(valueStr, value);
              }
              
              if (spec.type === "number") {
                const numValue = typeof value === "number" ? value : parseFloat(value);
                if (!isNaN(numValue)) {
                  numberValues.push({ name: valueStr, value: numValue });
                }
              }
            } else if (val !== null && val !== undefined) {
              // Sadə dəyər
              const valStr = String(val).trim();
              
              if (!allValuesMap.has(valStr)) {
                allValuesMap.set(valStr, val);
              }
              
              if (spec.type === "number") {
                const numValue = typeof val === "number" ? val : parseFloat(val);
                if (!isNaN(numValue)) {
                  numberValues.push({ name: valStr, value: numValue });
                }
              }
            }
          });
        }
      });

      // Number tipi üçün range-lər yarat (checkbox üçün)
      let numberRanges = null;
      if (spec.type === "number" && numberValues.length > 0) {
        // Bütün unique dəyərləri topla
        const uniqueValues = Array.from(new Set(numberValues.map(nv => nv.value))).sort((a, b) => a - b);
        
        if (uniqueValues.length > 0) {
          const minValue = uniqueValues[0];
          const maxValue = uniqueValues[uniqueValues.length - 1];
          const totalRange = maxValue - minValue;
          
          // Range-lər yarat - dinamik olaraq
          const ranges = [];
          
          // Minimum dəyərdən başla
          if (minValue > 0) {
            ranges.push({
              label: `0-dan ${minValue.toLocaleString()}-dək`,
              min: 0,
              max: minValue,
            });
          }
          
          // Orta range-lər
          if (uniqueValues.length <= 3) {
            // Az dəyər varsa, hər birini ayrı range kimi göstər
            uniqueValues.forEach((val, idx) => {
              if (idx < uniqueValues.length - 1) {
                ranges.push({
                  label: `${val.toLocaleString()}-dən ${uniqueValues[idx + 1].toLocaleString()}-dək`,
                  min: val,
                  max: uniqueValues[idx + 1],
                });
              }
            });
          } else {
            // Çox dəyər varsa, 3-5 range yarat
            const numRanges = Math.min(5, Math.max(3, Math.ceil(uniqueValues.length / 2)));
            const step = Math.max(1, Math.ceil(totalRange / numRanges));
            
            for (let i = minValue; i < maxValue; i += step) {
              const rangeMax = Math.min(i + step, maxValue);
              if (rangeMax > i) {
                ranges.push({
                  label: `${i.toLocaleString()}-dən ${rangeMax.toLocaleString()}-dək`,
                  min: i,
                  max: rangeMax,
                });
              }
            }
          }
          
          // "Daha çox" seçimi əlavə et
          ranges.push({
            label: `${maxValue.toLocaleString()}-dən daha çox`,
            min: maxValue,
            max: Infinity,
          });
          
          numberRanges = ranges;
        }
      }

      // Select, boolean və text üçün name-ə görə unique dəyərləri topla
      const uniqueValues = spec.type === "number" 
        ? null 
        : Array.from(allValuesMap.values()).sort();

        return {
        spec: spec,
          id: spec._id,
        name: spec.title || spec.name,
        type: spec.type,
        unit: spec.unit,
        values: uniqueValues,
        ranges: numberRanges, // Number tipi üçün range-lər
        count: productsForSpecOptions.filter((p) => {
          const specsObj = normalizeProductSpecs(p.specs);
          if (!specsObj) return false;
          const specName = spec.name || spec.title;
          return specsObj[specName] !== undefined && specsObj[specName] !== null;
        }).length,
      };
    }).filter((opt) => opt.count > 0); // Yalnız count > 0 olanları göstər
  }, [specs, productsForSpecOptions]);

  // Size options (specs-dən)
  const sizeOptions = useMemo(() => {
    const sizeSpecs = specs.filter((spec) =>
      spec.name.toLowerCase().includes("size") ||
      spec.name.toLowerCase().includes("ölçü") ||
      spec.name.toLowerCase().includes("mm") ||
      spec.name.toLowerCase().includes("×") ||
      spec.name.toLowerCase().includes("x")
    );

    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (stockStatus === "in_stock" && p.stock <= 0) return false;
      if (stockStatus === "out_of_stock" && p.stock > 0) return false;
      return true;
    });

    return sizeSpecs
      .map((spec) => {
        const count = filteredProducts.filter((p) => {
          const specsObj = normalizeProductSpecs(p.specs);
          if (!specsObj) return false;

          // Hər hansı value-da ölçü kimi dəyər varsa sadəcə sayırıq
          return Object.values(specsObj).some((val) => {
            if (typeof val !== "string") return false;
            return (
              val.toLowerCase().includes("mm") ||
              val.toLowerCase().includes("inch") ||
              val.toLowerCase().includes("x") ||
              val.toLowerCase().includes("×")
            );
          });
        }).length;

        return {
          name: spec.name,
          count: count.toString(),
          disabled: count === 0,
        };
      })
      .filter((opt) => opt.name);
  }, [specs, allProducts, selectedCategory, selectedSubcategory, stockStatus]);

  const breadcrumbs = useMemo(() => {
    const items = [
      { label: "Ana səhifə", path: "/" },
      { label: "Kataloq", path: "/catalog" },
    ];

    if (categorySlugParam) {
      const category = categories.find((cat) => cat.slug === categorySlugParam);
      if (category) {
        items.push({
          label: category.name,
          path: `/catalog/${category.slug}`,
        });

        if (subcategorySlugParam) {
          const subcategory = category.subcategories?.find(
            (sub) => sub.slug === subcategorySlugParam
          );
          if (subcategory) {
            items.push({
              label: subcategory.name,
              path: `/catalog/${category.slug}/${subcategory.slug}`,
            });
          }
        }
      }
    }

    return items;
  }, [categorySlugParam, subcategorySlugParam, categories]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlugParam);

  const subcategoriesWithData = useMemo(() => {
    if (!currentCategory || subcategorySlugParam) return [];

    return (currentCategory.subcategories || [])
      .map((sub) => {
        const subProducts = allProducts.filter((p) => {
          const sameCategory =
            p.category === currentCategory.name ||
            p.category === currentCategory.slug ||
            (p.category || "").toLowerCase() === (currentCategory.name || "").toLowerCase();

          const sameSub =
            p.subcategory === sub.name ||
            p.subcategory === sub.slug ||
            (p.subcategory || "").toLowerCase() === (sub.name || "").toLowerCase();

          return sameCategory && sameSub;
        });

        return {
          ...sub,
          productCount: subProducts.length,
          imageUrl: sub.image?.url || "",
        };
      })
      .filter((sub) => sub.productCount > 0 || sub.imageUrl);
  }, [currentCategory, subcategorySlugParam, allProducts]);

  const pricePresets = useMemo(() => {
    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (stockStatus === "in_stock" && p.stock <= 0) return false;
      if (stockStatus === "out_of_stock" && p.stock > 0) return false;
      return true;
    });

    const prices = filteredProducts
      .map((p) => p.price)
      .filter((p) => p && typeof p === "number")
      .sort((a, b) => a - b);

    if (prices.length === 0) return [];

    const minPrice = Math.floor(prices[0] / 100) * 100;
    const maxPrice = Math.ceil(prices[prices.length - 1] / 100) * 100;
    const range = maxPrice - minPrice;
    const step = Math.max(500, Math.floor(range / 4));

    const presets = [];
    for (let i = minPrice; i < maxPrice; i += step) {
      const count = prices.filter((p) => p >= i && p < i + step).length;
      if (count > 0) {
        presets.push({
          label: `${i.toLocaleString()} ₼-dən ${(i + step).toLocaleString()} ₼-dək`,
          min: i,
          max: i + step,
          count: count.toString(),
        });
      }
    }

    if (presets.length > 0) {
      const lessThanCount = prices.filter((p) => p < presets[0].min).length;
      if (lessThanCount > 0) {
        presets.unshift({
          label: `${presets[0].min.toLocaleString()} ₼-dən az`,
          min: 0,
          max: presets[0].min,
          count: lessThanCount.toString(),
        });
      }

      const moreThanCount = prices.filter((p) => p >= presets[presets.length - 1].max).length;
      if (moreThanCount > 0) {
        presets.push({
          label: `${presets[presets.length - 1].max.toLocaleString()} ₼-dən daha çox`,
          min: presets[presets.length - 1].max,
          max: Infinity,
          count: moreThanCount.toString(),
        });
      }
    }

    return presets;
  }, [allProducts, selectedCategory, selectedSubcategory, stockStatus]);

  // Bütün filtrləri təmizləmək üçün funksiya
  const clearAllFilters = () => {
    setStockStatus("");
    setSelectedSpecs({});
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceMin(0);
    setPriceMax(dynamicMaxPrice);
    setSelectedPricePreset("");
    setSearchTerm("");
    setSort("newest");
  };

  // Xüsusiyyət dəyəri seçimi - checkbox üçün
  const handleSpecValueToggle = (specId, value) => {
    setSelectedSpecs((prev) => {
      const currentValues = prev[specId] ? (Array.isArray(prev[specId]) ? prev[specId] : [prev[specId]]) : [];
      const isSelected = currentValues.includes(value);
      
      if (isSelected) {
        // Dəyəri sil
        const newValues = currentValues.filter(v => v !== value);
        if (newValues.length === 0) {
          const newSpecs = { ...prev };
          delete newSpecs[specId];
          return newSpecs;
        }
        return { ...prev, [specId]: newValues };
      } else {
        // Dəyəri əlavə et
        return { ...prev, [specId]: [...currentValues, value] };
      }
    });
  };

  // "Go back" button üçün dinamik mətn
  const getGoBackText = () => {
    if (subcategorySlugParam && currentCategory) {
      // Alt kategoriyada olduqda -> ana kategoriyaya qayıt
      return `${currentCategory.name} kateqoriyasına qayıt`;
    } else if (categorySlugParam) {
      // Ana kategoriyada olduqda -> bütün kateqoriyalara qayıt
      return "bütün kateqoriyalara qayıt";
    } else {
      // Heç bir kategoriyada deyil -> hər hansı bir şeyə qayıtmaq lazım deyil
      return "";
    }
  };

  const goBackPath = () => {
    if (subcategorySlugParam && currentCategory) {
      // Alt kategoriyadan ana kategoriyaya qayıt
      return `/catalog/${currentCategory.slug}`;
    } else if (categorySlugParam) {
      // Ana kategoriyadan bütün kateqoriyalara qayıt
      return "/catalog";
    } else {
      return "/catalog";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Product component'inin beklediği formata dönüştür
  const formattedProducts = products.map((product) => ({
    _id: product._id,
    slug: product.slug,
    name: product.name,
    brand: product.brand || "",
    model: product.model || "",
    price: `${product.price?.toFixed(2) || '0.00'} ₼`,
    inStock: product.stock > 0,
    imageUrl: product.images?.[0]?.url || product.image || "",
    imageAlt: product.name || "Məhsul Şəkli",
    isHot: product.specs?.OnSale || product.specs?.onSale || product.specs?.sale || false,
    rating: product.ratings || 5,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* Popular Categories Section */}
          {categorySlugParam && !subcategorySlugParam && subcategoriesWithData.length > 0 && (
            <div className="mb-8">
              {/* Küçük ekranlarda (mobil/tablet) veya fazla kategori varsa slider kullan */}
              <div className="hidden md:block">
                <SubcategorySlider 
                  subcategories={subcategoriesWithData} 
                  categorySlug={categorySlugParam}
                />
              </div>
              
              {/* Mobil için basit grid */}
              <div className="md:hidden">
                <SubcategoryGrid 
                  subcategories={subcategoriesWithData} 
                  categorySlug={categorySlugParam}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 pb-6">
            {/* Mobile Overlay */}
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
            )}

            {/* Filter Panel */}
            <div
              className={`fixed lg:relative top-0 right-0 h-screen lg:h-auto w-[85vw] max-w-sm lg:max-w-none bg-white p-6 pb-32 lg:pb-6 rounded-none lg:rounded-2xl shadow-xl lg:shadow-md border border-gray-200/60 z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
                isFilterOpen ? "translate-x-0" : "translate-x-full"
              } lg:translate-x-0 lg:block w-full lg:w-80 overflow-y-auto`}
            >
              {/* Mobile Close Button */}
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-xl font-bold text-gray-800">Filtrlər</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Category Section */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Kateqoriya</p>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentCategory?.name || "Bütün məhsullar"}
                  </h3>
                  
                  {/* Dinamik "go back" linki */}
                  {getGoBackText() && (
                    <button
                      onClick={() => {
                        navigate(goBackPath());
                      }}
                      className="text-sm text-[#5C4977] hover:underline mt-1 cursor-pointer"
                    >
                      {getGoBackText()}
                    </button>
                  )}

                  <div className="mt-4 space-y-2">
                    {!selectedCategory
                      ? categories.map((category) => {
                          const categoryProducts = allProducts.filter((p) => {
                            return (
                              p.category === category.name ||
                              p.category === category.slug ||
                              (p.category || "").toLowerCase() ===
                                (category.name || "").toLowerCase()
                            );
                          });
                          const categoryCount = categoryProducts.length;

                          return (
                            <button
                              key={category._id}
                              className={`w-full flex items-center justify-between text-base text-gray-800 hover:text-[#5C4977] hover:font-bold py-2 cursor-pointer transition-all duration-200 ${
                                selectedCategory === category.name ? "text-[#5C4977] font-bold" : ""
                              }`}
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setSelectedSubcategory("");
                                navigate(`/catalog/${category.slug}`);
                              }}
                            >
                              <span>{category.name}</span>
                              <span className="text-m text-gray-500">{categoryCount}</span>
                            </button>
                          );
                        })
                      : currentCategory?.subcategories?.map((sub) => {
                          const subProducts = allProducts.filter((p) => {
                            const sameCategory =
                              p.category === currentCategory.name ||
                              p.category === currentCategory.slug ||
                              (p.category || "").toLowerCase() ===
                                (currentCategory.name || "").toLowerCase();

                            const sameSub =
                              p.subcategory === sub.name ||
                              p.subcategory === sub.slug ||
                              (p.subcategory || "").toLowerCase() ===
                                (sub.name || "").toLowerCase();

                            return sameCategory && sameSub;
                          });
                          const subCount = subProducts.length;

                          if (subCount === 0) return null;

                          return (
                            <button
                              key={sub._id || sub.name}
                              className={`w-full flex items-center justify-between text-base text-gray-800 hover:text-[#5C4977] hover:font-bold py-2 cursor-pointer transition-all duration-200 ${
                                selectedSubcategory === sub.name ? "text-[#5C4977] font-bold" : ""
                              }`}
                              onClick={() => {
                                const subSlug =
                                  sub.slug || encodeURIComponent(sub.name.toLowerCase().replace(/\s+/g, "-"));
                                navigate(`/catalog/${currentCategory.slug}/${subSlug}`);
                              }}
                            >
                              <span>{sub.name}</span>
                              <span className="text-m text-gray-500">{subCount}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>

               

                {/* Price Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Qiymət</h3>

                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Min.</label>
                        <input
                          type="number"
                          value={inputPriceMin === "" ? "" : inputPriceMin}
                          placeholder={priceMin.toString()}
                          onChange={(e) => {
                            setSelectedPricePreset("");
                            setInputPriceMin(e.target.value);
                          }}
                          onFocus={(e) => {
                            e.target.select();
                            setInputPriceMin("");
                          }}
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          min="0"
                          max={dynamicMaxPrice}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Maks.</label>
                        <input
                          type="number"
                          value={inputPriceMax === "" ? "" : inputPriceMax}
                          placeholder={priceMax.toString()}
                          onChange={(e) => {
                            setSelectedPricePreset("");
                            setInputPriceMax(e.target.value);
                          }}
                          onFocus={(e) => {
                            e.target.select();
                            setInputPriceMax("");
                          }}
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          min="0"
                          max={dynamicMaxPrice}
                        />
                      </div>
                    </div>
                    
                    {/* Tətbiq et button */}
                    <button
                      onClick={() => {
                        setSelectedPricePreset("");
                        let newMin = priceMin;
                        let newMax = priceMax;
                        
                        // Parse input values
                        if (inputPriceMin !== "") {
                          const numMin = Number(inputPriceMin);
                          if (!isNaN(numMin) && numMin >= 0) {
                            newMin = Math.max(0, Math.min(dynamicMaxPrice, numMin));
                          }
                        }
                        
                        if (inputPriceMax !== "") {
                          const numMax = Number(inputPriceMax);
                          if (!isNaN(numMax) && numMax >= 0) {
                            newMax = Math.max(0, Math.min(dynamicMaxPrice, numMax));
                          }
                        }
                        
                        // Ensure min <= max
                        if (newMin > newMax) {
                          const temp = newMin;
                          newMin = newMax;
                          newMax = temp;
                        }
                        
                        // Update prices
                        setPriceMin(newMin);
                        setPriceMax(newMax);
                        
                        // Clear input fields
                        setInputPriceMin("");
                        setInputPriceMax("");
                      }}
                      className="w-full bg-[#5C4977] hover:bg-[#5C4977]/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-md shadow-[#5C4977]/20 text-sm cursor-pointer"
                    >
                      Tətbiq et
                    </button>
                    
                    <RangeSlider
                      min={0}
                      max={dynamicMaxPrice}
                      valueMin={priceMin}
                      valueMax={priceMax}
                      onChangeMin={(val) => {
                        setSelectedPricePreset("");
                        setPriceMin(val);
                      }}
                      onChangeMax={(val) => {
                        setSelectedPricePreset("");
                        setPriceMax(val);
                      }}
                    />
                  </div>

                  {pricePresets.length > 0 && (
                    <div className="space-y-3">
                      {pricePresets.slice(0, 3).map((preset, index) => {
                        const isActive = selectedPricePreset === preset.label;
                        const maxValue = preset.max === Infinity ? dynamicMaxPrice : preset.max;

                        return (
                          <label
                            key={`${preset.label}-${index}`}
                            className="flex items-center justify-between text-sm text-gray-800 cursor-pointer hover:text-[#5C4977]"
                            onClick={() => {
                              setSelectedPricePreset(preset.label);
                              setPriceMin(preset.min || 0);
                              setPriceMax(maxValue);
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isActive ? "border-[#5C4977]" : "border-gray-300"
                                }`}
                              >
                                {isActive && <span className="w-2 h-2 rounded-full bg-[#5C4977]" />}
                              </span>
                              <span className="whitespace-nowrap">{preset.label}</span>
                            </span>
                            <span className="text-xs text-gray-500">{preset.count}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                 {/* Stock Status Section - İLK BURADA */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Stok statusu</h3>
                  <div className="space-y-3">
                    {stockOptions.map((option) => {
                      const isSelected = stockStatus === option.value;
                      const isDisabled = option.disabled;

                      return (
                        <label
                          key={option.value}
                          className={`flex items-center justify-between text-sm ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                          } ${isSelected ? "text-[#5C4977]" : "text-gray-800"}`}
                          onClick={() => {
                            if (isDisabled) return;
                            setStockStatus(isSelected ? "" : option.value);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-[#5C4977]" : "border-gray-300"
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-[#5C4977]" />}
                            </span>
                            <span>{option.label}</span>
                          </span>
                          <span className="text-xs text-gray-500">{option.count}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Specs Section - Dinamik Xüsusiyyətlər */}
                {dynamicSpecOptions.length > 0 && (
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Xüsusiyyətlər</h3>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
                      {dynamicSpecOptions.map((specOption) => {
                        const spec = specOption.spec;
                        const selectedValues = selectedSpecs[specOption.id] 
                          ? (Array.isArray(selectedSpecs[specOption.id]) 
                              ? selectedSpecs[specOption.id] 
                              : [selectedSpecs[specOption.id]])
                          : [];

                        return (
                          <div key={specOption.id} className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                              {specOption.name}
                            </label>

                            {/* Select tipi - Checkbox-lar */}
                            {spec.type === "select" && (
                              <div className="space-y-2">
                                {specOption.values.map((value, idx) => {
                                  const isSelected = selectedValues.includes(value);
                                  return (
                                    <label
                                      key={idx}
                                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#5C4977] transition-colors"
                                      onClick={() => handleSpecValueToggle(specOption.id, value)}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSpecValueToggle(specOption.id, value)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                                      />
                                      <span className={isSelected ? "text-[#5C4977] font-medium" : "text-gray-800"}>
                                        {value}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                            {/* Boolean tipi - Checkbox-lar */}
                            {spec.type === "boolean" && (
                              <div className="space-y-2">
                                <label
                                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#5C4977] transition-colors"
                                  onClick={() => handleSpecValueToggle(specOption.id, "true")}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedValues.includes("true")}
                                    onChange={() => handleSpecValueToggle(specOption.id, "true")}
                                    className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                                  />
                                  <span className={selectedValues.includes("true") ? "text-[#5C4977] font-medium" : "text-gray-800"}>
                                    Bəli
                                  </span>
                                </label>
                                <label
                                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#5C4977] transition-colors"
                                  onClick={() => handleSpecValueToggle(specOption.id, "false")}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedValues.includes("false")}
                                    onChange={() => handleSpecValueToggle(specOption.id, "false")}
                                    className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                                  />
                                  <span className={selectedValues.includes("false") ? "text-[#5C4977] font-medium" : "text-gray-800"}>
                                    Xeyr
                                  </span>
                                </label>
                              </div>
                            )}

                            {/* Number tipi - Range checkbox-lar (unit ilə) */}
                            {spec.type === "number" && specOption.ranges && specOption.ranges.length > 0 && (
                              <div className="space-y-2">
                                {specOption.ranges.map((range, idx) => {
                                  const rangeValue = `${range.min}-${range.max === Infinity ? 'inf' : range.max}`;
                                  const isSelected = selectedValues.includes(rangeValue);
                                  const unitText = specOption.unit && typeof specOption.unit === "object" 
                                    ? ` ${specOption.unit.title || specOption.unit.name}`
                                    : "";
                                  
                                  // Label formatı - Azərbaycan dilində
                                  let rangeLabel = "";
                                  if (range.max === Infinity) {
                                    rangeLabel = `${range.min.toLocaleString()}${unitText}-dən daha çox`;
                                  } else if (range.min === range.max) {
                                    rangeLabel = `${range.min.toLocaleString()}${unitText}`;
                                  } else {
                                    rangeLabel = `${range.min.toLocaleString()}${unitText}-dən ${range.max.toLocaleString()}${unitText}-dək`;
                                  }
                                  
                                  return (
                                    <label
                                      key={idx}
                                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#5C4977] transition-colors"
                                      onClick={() => handleSpecValueToggle(specOption.id, rangeValue)}
                                    >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                        onChange={() => handleSpecValueToggle(specOption.id, rangeValue)}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                              />
                                      <span className={isSelected ? "text-[#5C4977] font-medium" : "text-gray-800"}>
                                        {rangeLabel}
                            </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Brand Section - ÜÇÜNCÜ BURADA */}
                {brandOptions.length > 0 && (
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Brend</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {brandOptions.map((brand) => {
                        const isSelected = selectedBrands.includes(brand.name);
                        const isDisabled = brand.disabled;

                        const checkboxId = `brand-${brand.id || brand.name}`;
                        return (
                          <div
                            key={brand.id || brand.name}
                            className={`flex items-center justify-between text-sm cursor-pointer select-none ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            } ${isSelected ? "text-[#5C4977]" : "text-gray-800"}`}
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedBrands((prev) =>
                                prev.includes(brand.name)
                                  ? prev.filter((b) => b !== brand.name)
                                  : [...prev, brand.name]
                              );
                              setSelectedBrand("");
                            }}
                          >
                            <span className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                disabled={isDisabled}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                              />
                              <span>{brand.name}</span>
                            </span>
                            <span className="text-xs text-gray-500">{brand.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Section */}
                {sizeOptions.length > 0 && (
                  <div className="pb-2">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Ölçü</h3>
                    <div className="space-y-3">
                      {sizeOptions.map((size) => {
                        const isSelected = selectedSizes.includes(size.name);
                        const isDisabled = size.disabled;

                        return (
                          <label
                            key={size.name}
                            className={`flex items-center justify-between text-sm cursor-pointer select-none ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            } ${isSelected ? "text-[#5C4977]" : "text-gray-800"}`}
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedSizes((prev) =>
                                prev.includes(size.name)
                                  ? prev.filter((s) => s !== size.name)
                                  : [...prev, size.name]
                              );
                            }}
                          >
                            <span className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                disabled={isDisabled}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                              />
                              <span>{size.name}</span>
                            </span>
                            <span className="text-xs text-gray-500">{size.count}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobil Filter Toggle */}
              <div className="lg:hidden mb-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="cursor-pointer">
                  <FilterIcon className="h-4 w-4 mr-1" />
                  {isFilterOpen ? "Filtrləri Gizlət" : "Filtrləri Göstər"}
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-[#5C4977] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Sorting - Custom Dropdown */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {breadcrumbs[breadcrumbs.length - 1]?.label || "Kataloq"}
                </h2>
                <div className="relative w-full sm:w-64 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-[#5C4977] transition-all cursor-pointer shadow-sm hover:border-gray-400 text-gray-800 font-medium flex items-center justify-between"
                    style={{ cursor: 'pointer' }}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      {sort === "" && "Varsayılan sıralama"}
                      {sort === "price_asc" && "Qiymət: aşağıdan yuxarı"}
                      {sort === "price_desc" && "Qiymət: yuxarıdan aşağı"}
                      {sort === "newest" && "Ən yenilər"}
                      {sort === "oldest" && "Ən köhnələr"}
                      {sort === "top_rated" && "Ən yüksək reytinqli"}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-[#5C4977] transition-transform duration-200 cursor-pointer ${
                        isSortDropdownOpen ? 'rotate-180' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                    />
                  </button>
                  
                  {isSortDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsSortDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 overflow-hidden">
                        <div className="pt-3 pb-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSort("");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                              sort === "" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Varsayılan sıralama
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSort("price_asc");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                              sort === "price_asc" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Qiymət: aşağıdan yuxarı
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSort("price_desc");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                              sort === "price_desc" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Qiymət: yuxarıdan aşağı
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSort("newest");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                              sort === "newest" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Ən yenilər
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSort("oldest");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                              sort === "oldest" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Ən köhnələr
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSort("top_rated");
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                              sort === "top_rated" 
                                ? "bg-[#5C4977] text-white" 
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            Ən yüksək reytinqli
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Məhsul Kartları - Product component kullan */}
              <div className="relative">
                {/* Loading overlay - filter değiştiğinde göster */}
                {isFetching && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                    <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
                  </div>
                )}
                {formattedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {formattedProducts.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#5C4977]/10">
                    <div className="text-[#5C4977]/60 text-5xl mb-4">😕</div>
                    <div className="text-gray-400 text-lg mb-2">Məhsul tapılmadı</div>
                    <div className="text-gray-500 text-sm mb-6">
                      Seçdiyiniz filterlərə uyğun məhsul yoxdur.
                    </div>
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="cursor-pointer"
                    >
                      Filtrləri Təmizlə
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Filter;