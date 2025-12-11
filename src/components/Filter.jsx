// src/pages/Filter.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Check, Shuffle, Search, Heart, Filter as FilterIcon } from "lucide-react";
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
          <Check className="w-4 h-4 text-green-600" />
          <span>{inStockText}</span>
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

  // Brand options (mövcud kateqoriya/subkateqoriya üzrə)
  const brandOptions = useMemo(() => {
    if (!brands.length) return [];

    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
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
  }, [brands, allProducts, selectedCategory, selectedSubcategory]);

  // Spec options – BURANI DÜZƏLTDİK
  const specOptions = useMemo(() => {
    if (!specs.length) return [];

    const filteredProducts = allProducts.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
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
  }, [specs, allProducts, selectedCategory, selectedSubcategory]);

  // Size options (specs-dən) – ən azından parse edək ki, ilişməsin
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
  }, [specs, allProducts, selectedCategory, selectedSubcategory]);

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
  }, [allProducts, selectedCategory, selectedSubcategory]);

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
      <div className="min-h-screen bg-white pt-24 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} />

          {/* Popular Categories Section */}
          {categorySlugParam && !subcategorySlugParam && subcategoriesWithData.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#5C4977] mb-6">Populyar Kateqoriyalar</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {subcategoriesWithData.map((sub) => {
                  const subSlug = sub.slug || encodeURIComponent(sub.name.toLowerCase().replace(/\s+/g, "-"));
                  return (
                    <Link
                      key={sub._id || sub.name}
                      to={`/catalog/${categorySlugParam}/${subSlug}`}
                      className="shrink-0 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-[#5C4977]/10 hover:border-[#5C4977]/30 w-[200px]"
                    >
                      <div className="w-full aspect-square flex justify-center items-center bg-[#f8f7fa] rounded-lg mb-3">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="object-contain w-36 h-36"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/150x150/6B7280/ffffff?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-36 h-36 flex items-center justify-center text-[#5C4977]/60">
                            <span className="text-sm">Şəkil yoxdur</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-[#5C4977] text-center mb-1" style={{ fontSize: "19px" }}>
                        {sub.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {sub.productCount} məhsul
                        {sub.productCount !== 1 ? "" : ""}
                      </p>
                    </Link>
                  );
                })}
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
                {/* Category Section */}
                <div className="pb-6 border-b border-gray-200">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subcategory</p>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentCategory?.name || "Bütün məhsullar"}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                      navigate("/catalog");
                    }}
                    className="text-sm text-[#5C4977] hover:underline mt-1"
                  >
                    go back to Laptops
                  </button>

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

                {/* Brand Section */}
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
                            className={`flex items-center justify-between text-sm text-gray-800 ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
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

                {/* Specs Section – artıq kliklənir */}
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
                            className={`flex items-center justify-between text-sm text-gray-800 ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
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
                            className={`flex items-center justify-between text-sm text-gray-800 ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
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
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                      setSelectedBrand("");
                      setSelectedBrands([]);
                      setSelectedSizes([]);
                      setPriceMin(0);
                      setPriceMax(3000);
                      setSearchTerm("");
                      setSort("newest");
                      setSelectedSpecs([]);
                    }}
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
