// src/pages/Filter.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Check, Shuffle, Search, Heart, Filter as FilterIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
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
import MetaShopHeader from "./Navbar";

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
        to={`/product/${mehsul?._id}`}
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
        <Link to={`/product/${mehsul?._id}`}>
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
  const minPercentage = ((valueMin - min) / (max - min)) * 100;
  const maxPercentage = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="relative pt-4">
      <div className="relative w-full h-5">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2">
          <div
            className="absolute top-0 h-full bg-[#5C4977] rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>
        
        {/* Min handle */}
        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-[#5C4977] rounded-full shadow transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
          style={{ left: `${minPercentage}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startValue = valueMin;
            const rangeWidth = max - min;

            const handleMouseMove = (moveEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const deltaValue = (deltaX / 300) * rangeWidth;
              const newValue = Math.max(min, Math.min(valueMax - 100, startValue + deltaValue));
              onChangeMin(Math.round(newValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Max handle */}
        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-[#5C4977] rounded-full shadow transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startValue = valueMax;
            const rangeWidth = max - min;

            const handleMouseMove = (moveEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const deltaValue = (deltaX / 300) * rangeWidth;
              const newValue = Math.max(valueMin + 100, Math.min(max, startValue + deltaValue));
              onChangeMax(Math.round(newValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min.toLocaleString()} ₼</span>
        <span>{max.toLocaleString()} ₼</span>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {subcategories.map((sub) => {
        const subSlug = sub.slug || encodeURIComponent(sub.name.toLowerCase().replace(/\s+/g, "-"));
        return (
          <Link
            key={sub._id || sub.name}
            to={`/catalog/${categorySlug}/${subSlug}`}
            className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#5C4977]/10 hover:border-[#5C4977]/30"
          >
            <div className="w-full aspect-square flex justify-center items-center bg-[#f8f7fa] rounded-lg mb-3 overflow-hidden">
              {sub.imageUrl ? (
                <img
                  src={sub.imageUrl}
                  alt={sub.name}
                  className="object-contain w-32 h-32 transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-[#5C4977]/60">
                  <span className="text-sm text-center px-2">Şəkil yoxdur</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-[#5C4977] text-center mb-1 line-clamp-1" style={{ fontSize: "17px" }}>
              {sub.name}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {sub.productCount} məhsul
              {sub.productCount !== 1 ? "" : ""}
            </p>
            <div className="mt-2 flex justify-center">
              <span className="text-xs text-[#5C4977] bg-[#5C4977]/10 px-2 py-1 rounded-full">
                Bax →
              </span>
            </div>
          </Link>
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
          const subSlug = sub.slug || encodeURIComponent(sub.name.toLowerCase().replace(/\s+/g, "-"));
          return (
            <SwiperSlide key={sub._id || sub.name}>
              <Link
                to={`/catalog/${categorySlug}/${subSlug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-[#5C4977]/10 hover:border-[#5C4977]/30 h-full"
              >
                <div className="w-full aspect-square flex justify-center items-center bg-[#f8f7fa] rounded-lg mb-3 overflow-hidden">
                  {sub.imageUrl ? (
                    <img
                      src={sub.imageUrl}
                      alt={sub.name}
                      className="object-contain w-32 h-32 transform hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center text-[#5C4977]/60">
                      <span className="text-sm text-center px-2">Şəkil yoxdur</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-[#5C4977] text-center mb-1 line-clamp-1" style={{ fontSize: "17px" }}>
                  {sub.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {sub.productCount} məhsul
                  {sub.productCount !== 1 ? "" : ""}
                </p>
                <div className="mt-2 flex justify-center">
                  <span className="text-xs text-[#5C4977] bg-[#5C4977]/10 px-2 py-1 rounded-full">
                    Bax →
                  </span>
                </div>
              </Link>
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
  const [selectedPricePreset, setSelectedPricePreset] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Yeni: Stock status filteri
  const [stockStatus, setStockStatus] = useState(""); // "in_stock", "out_of_stock" və ya ""
  const [selectedSpecs, setSelectedSpecs] = useState([]);

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

    if (priceMin > 0) query.minPrice = priceMin;
    if (priceMax < 3000) query.maxPrice = priceMax;
    if (searchTerm) query.search = searchTerm;
    if (sort) query.sort = sort;

    // Stock status filter
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }

    // Spec filter → ID-lərlə
    if (selectedSpecs.length > 0) query.specs = selectedSpecs;

    if (selectedSizes.length > 0) query.sizes = selectedSizes;

    return query;
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    selectedBrands,
    priceMin,
    priceMax,
    searchTerm,
    sort,
    stockStatus,
    selectedSpecs,
    selectedSizes,
  ]);

  const { data, error, isError, isLoading } = useFilterProductsQuery(filterQuery);

  useEffect(() => {
    if (isError) {
      console.error(error);
      toast.error(error?.data?.message || "Bir xəta baş verdi!");
    }
  }, [isError, error]);

  const products = data?.products || [];

  // Active filterləri saymaq üçün
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (stockStatus) count++;
    if (selectedSpecs.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (selectedSizes.length > 0) count++;
    if (priceMin > 0 || priceMax < 3000) count++;
    return count;
  }, [stockStatus, selectedSpecs, selectedBrands, selectedSizes, priceMin, priceMax]);

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
        label: "In Stock",
        count: inStockCount,
        disabled: inStockCount === 0,
      },
      {
        value: "out_of_stock",
        label: "Out of Stock",
        count: outOfStockCount,
        disabled: outOfStockCount === 0,
      },
    ];
  }, [allProducts, selectedCategory, selectedSubcategory]);

  // Brand options (mövcud kateqoriya/subkateqoriya üzrə)
  const brandOptions = useMemo(() => {
    if (!brands.length) return [];

    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (stockStatus === "in_stock" && p.stock <= 0) return false;
      if (stockStatus === "out_of_stock" && p.stock > 0) return false;
      return true;
    });

    return brands
      .map((brand) => {
        const count = filteredProducts.filter((p) => p.brand === brand.name).length;
        return {
          id: brand._id,
          name: brand.name,
          count,
          disabled: count === 0,
        };
      })
      .filter((b) => b.name);
  }, [brands, allProducts, selectedCategory, selectedSubcategory, stockStatus]);

  // Spec options
  const specOptions = useMemo(() => {
    if (!specs.length) return [];

    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (stockStatus === "in_stock" && p.stock <= 0) return false;
      if (stockStatus === "out_of_stock" && p.stock > 0) return false;
      return true;
    });

    return specs
      .map((spec) => {
        const count = filteredProducts.filter((p) => {
          const specsObj = normalizeProductSpecs(p.specs);
          if (!specsObj) return false;

          // product.specs içində bu spec-in ID-si varsa → say
          return Object.prototype.hasOwnProperty.call(specsObj, spec._id);
        }).length;

        return {
          id: spec._id,
          name: spec.name,
          count,
          disabled: count === 0,
        };
      })
      .filter((s) => s.name);
  }, [specs, allProducts, selectedCategory, selectedSubcategory, stockStatus]);

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
          label: `${i.toLocaleString()} ₼ to ${(i + step).toLocaleString()} ₼`,
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
          label: `less than ${presets[0].min.toLocaleString()} ₼`,
          min: 0,
          max: presets[0].min,
          count: lessThanCount.toString(),
        });
      }

      const moreThanCount = prices.filter((p) => p >= presets[presets.length - 1].max).length;
      if (moreThanCount > 0) {
        presets.push({
          label: `more than ${presets[presets.length - 1].max.toLocaleString()} ₼`,
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
    setSelectedSpecs([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceMin(0);
    setPriceMax(3000);
    setSelectedPricePreset("");
    setSearchTerm("");
    setSort("newest");
  };

  // "Go back" button üçün dinamik mətn
  const getGoBackText = () => {
    if (subcategorySlugParam && currentCategory) {
      // Alt kategoriyada olduqda -> ana kategoriyaya qayıt
      return `go back to ${currentCategory.name}`;
    } else if (categorySlugParam) {
      // Ana kategoriyada olduqda -> bütün kateqoriyalara qayıt
      return "go back to all categories";
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
      <>
        <MetaShopHeader />
        <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977] mb-4"></div>
            <div className="text-lg text-[#5C4977]">Məhsullar yüklənir...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MetaShopHeader />
      <div className="min-h-screen bg-white pt-10 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Custom Breadcrumb */}
          <CustomBreadcrumb items={breadcrumbs} />

          {/* Popular Categories Section */}
          {categorySlugParam && !subcategorySlugParam && subcategoriesWithData.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 bg-[#5C4977]/10 px-3 py-1 rounded-full">
                  {subcategoriesWithData.length} kategoriya
                </span>
              </div>
              
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

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Panel */}
            <div
              className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200/60 ${
                isFilterOpen ? "block" : "hidden"
              } lg:block w-full lg:w-80`}
            >
              <div className="space-y-8">
                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">Aktiv Filtrlər</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#5C4977] hover:text-[#5C4977]/80 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Hamısını təmizlə
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stockStatus && (
                        <span className="inline-flex items-center gap-1 bg-[#5C4977]/10 text-[#5C4977] text-sm px-3 py-1.5 rounded-full">
                          {stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
                          <button
                            onClick={() => setStockStatus("")}
                            className="hover:text-[#5C4977]/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedSpecs.map((specId) => {
                        const spec = specs.find((s) => s._id === specId);
                        if (!spec) return null;
                        return (
                          <span key={specId} className="inline-flex items-center gap-1 bg-[#5C4977]/10 text-[#5C4977] text-sm px-3 py-1.5 rounded-full">
                            {spec.name}
                            <button
                              onClick={() => setSelectedSpecs(prev => prev.filter(id => id !== specId))}
                              className="hover:text-[#5C4977]/70"
                            >
                              <X className="w-3 h-3" />
                          </button>
                          </span>
                        );
                      })}
                      {selectedBrands.map((brandName) => (
                        <span key={brandName} className="inline-flex items-center gap-1 bg-[#5C4977]/10 text-[#5C4977] text-sm px-3 py-1.5 rounded-full">
                          {brandName}
                          <button
                            onClick={() => setSelectedBrands(prev => prev.filter(b => b !== brandName))}
                            className="hover:text-[#5C4977]/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {(priceMin > 0 || priceMax < 3000) && (
                        <span className="inline-flex items-center gap-1 bg-[#5C4977]/10 text-[#5C4977] text-sm px-3 py-1.5 rounded-full">
                          {priceMin.toLocaleString()}₼ - {priceMax.toLocaleString()}₼
                          <button
                            onClick={() => {
                              setPriceMin(0);
                              setPriceMax(3000);
                              setSelectedPricePreset("");
                            }}
                            className="hover:text-[#5C4977]/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Section */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subcategory</p>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentCategory?.name || "Bütün məhsullar"}
                  </h3>
                  
                  {/* Dinamik "go back" linki */}
                  {getGoBackText() && (
                    <button
                      onClick={() => {
                        navigate(goBackPath());
                      }}
                      className="text-sm text-[#5C4977] hover:underline mt-1"
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
                              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 border border-transparent transition-colors ${
                                selectedCategory === category.name
                                  ? "bg-[#5C4977]/5 border-[#5C4977]/30"
                                  : "hover:border-gray-200"
                              }`}
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setSelectedSubcategory("");
                                navigate(`/catalog/${category.slug}`);
                              }}
                            >
                              <span className="flex items-center gap-2 text-sm text-gray-800">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    selectedCategory === category.name ? "bg-[#5C4977]" : "bg-gray-300"
                                  }`}
                                />
                                {category.name}
                              </span>
                              <span className="text-xs text-gray-500">{categoryCount}</span>
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
                              className={`w-full flex items-center justify-between rounded-lg px-3 py-2 border border-transparent transition-colors ${
                                selectedSubcategory === sub.name
                                  ? "bg-[#5C4977]/5 border-[#5C4977]/30"
                                  : "hover:border-gray-200"
                              }`}
                              onClick={() => {
                                const subSlug =
                                  sub.slug || encodeURIComponent(sub.name.toLowerCase().replace(/\s+/g, "-"));
                                navigate(`/catalog/${currentCategory.slug}/${subSlug}`);
                              }}
                            >
                              <span className="flex items-center gap-2 text-sm text-gray-800">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    selectedSubcategory === sub.name ? "bg-[#5C4977]" : "bg-gray-300"
                                  }`}
                                />
                                {sub.name}
                              </span>
                              <span className="text-xs text-gray-500">{subCount}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>

               

                {/* Price Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Price</h3>

                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">min.</label>
                        <input
                          type="number"
                          value={priceMin}
                          onChange={(e) => {
                            setSelectedPricePreset("");
                            setPriceMin(Number(e.target.value) || 0);
                          }}
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">max.</label>
                        <input
                          type="number"
                          value={priceMax}
                          onChange={(e) => {
                            setSelectedPricePreset("");
                            setPriceMax(Number(e.target.value) || 0);
                          }}
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          min="0"
                        />
                      </div>
                    </div>

                    <RangeSlider
                      min={0}
                      max={3000}
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
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>min.</span>
                      <span>max.</span>
                    </div>
                  </div>

                  {pricePresets.length > 0 && (
                    <div className="space-y-3">
                      {pricePresets.slice(0, 3).map((preset, index) => {
                        const isActive = selectedPricePreset === preset.label;
                        const maxValue = preset.max === Infinity ? 3000 : preset.max;

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
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Stock Status</h3>
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

                {/* Specs Section - İKİNCİ BURADA */}
                {specOptions.length > 0 && (
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Xüsusiyyətlər</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {specOptions.map((spec) => {
                        const isSelected = selectedSpecs.includes(spec.id);
                        const isDisabled = spec.disabled;

                        return (
                          <label
                            key={spec.id || spec.name}
                            className={`flex items-center justify-between text-sm ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            } ${isSelected ? "text-[#5C4977]" : "text-gray-800"}`}
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedSpecs((prev) =>
                                prev.includes(spec.id)
                                  ? prev.filter((s) => s !== spec.id)
                                  : [...prev, spec.id]
                              );
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                disabled={isDisabled}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977]"
                              />
                              <span>{spec.name}</span>
                            </span>
                            <span className="text-xs text-gray-500">{spec.count}</span>
                          </label>
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

                        return (
                          <label
                            key={brand.id || brand.name}
                            className={`flex items-center justify-between text-sm ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                disabled={isDisabled}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977]"
                              />
                              <span>{brand.name}</span>
                            </span>
                            <span className="text-xs text-gray-500">{brand.count}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Section */}
                {sizeOptions.length > 0 && (
                  <div className="pb-2">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Size</h3>
                    <div className="space-y-3">
                      {sizeOptions.map((size) => {
                        const isSelected = selectedSizes.includes(size.name);
                        const isDisabled = size.disabled;

                        return (
                          <label
                            key={size.name}
                            className={`flex items-center justify-between text-sm ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                disabled={isDisabled}
                                className="w-4 h-4 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977]"
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
                <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <FilterIcon className="h-4 w-4 mr-1" />
                  {isFilterOpen ? "Filtrləri Gizlət" : "Filtrləri Göstər"}
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-[#5C4977] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Page header & sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {currentCategory?.name || "Apple MacBook"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Showing all {products.length || 0} results</p>
                </div>
                <div className="w-full sm:w-64">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                  >
                    <option value="">Default sorting</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="top_rated">Top rated</option>
                  </select>
                </div>
              </div>

              {/* Məhsul Kartları */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="relative flex justify-center">
                      {/* On Sale badge */}
                      {(product.specs?.OnSale || product.specs?.onSale || product.specs?.sale) && (
                        <span className="absolute top-2 left-2 bg-[#fe9034] text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                          Endirimdə
                        </span>
                      )}

                      {/* Featured badge */}
                      {(product.specs?.Featured || product.specs?.featured) && (
                        <span className="absolute top-2 left-20 bg-[#5C4977] text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                          Seçilmiş
                        </span>
                      )}

                      {/* Stock Status badge */}
                      {product.stock === 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                          Stokda yoxdur
                        </span>
                      )}

                      <ProductCard mehsul={product} />
                    </div>
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
                  >
                    Filtrləri Təmizlə
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Filter;