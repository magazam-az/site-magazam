import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  useGetProductDetailsQuery, 
  useAddToCartMutation, 
  useAddToFavoritesMutation
} from '../redux/api/productsApi';
import { useGetCategoriesQuery } from '../redux/api/categoryApi';
import { toast } from "react-hot-toast";
import { Heart, Share2, GitCompare, Eye, ShoppingBag, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { FaApplePay, FaGooglePay } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import Navbar from './Navbar';
import Footer from './Footer';

// ⭐ REUSABLE STAR RATING COMPONENT
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? "fill-yellow-400" : "fill-gray-300"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.033a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.42 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

/*---------------------- Custom Breadcrumb Component ----------------------*/
const CustomBreadcrumb = ({ items }) => {
  return (
    <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 sm:mx-2 text-gray-400">/</span>
            )}
            {index === items.length - 1 ? (
              // Sonuncu item - qara rəng və böyük font
              <span className="text-black font-semibold text-base sm:text-lg">
                {item.label}
              </span>
            ) : item.path ? (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-[#5C4977] transition-colors text-sm sm:text-base"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 text-sm sm:text-base">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const ProductDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(params?.id);
  const product = data?.product;

  // Get categories to find slugs
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // RTK Query mutations
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToFavorites, { isLoading: isAddingToFavorites }] = useAddToFavoritesMutation();

  const [activeImg, setActiveImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [thumbnailsIndex, setThumbnailsIndex] = useState(0);

  // Refs for carousel
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  // ✅ Stok yoxlaması
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImg(product.images[0].url);
    } else {
      setActiveImg("https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg");
    }
  }, [product]);

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    }
    if (type === 'inc') {
      const maxQty = product?.stock ?? 1;
      if (quantity < maxQty) {
        setQuantity(quantity + 1);
      } else {
        toast.error("Stokda bu qədər məhsul yoxdur!");
      }
    }
  };

  const handleMainImageChange = (index) => {
    if (product?.images?.[index]) {
      setMainImageIndex(index);
      setActiveImg(product.images[index].url);
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      const nextIndex = (mainImageIndex + 1) % product.images.length;
      handleMainImageChange(nextIndex);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      const prevIndex = mainImageIndex === 0 ? product.images.length - 1 : mainImageIndex - 1;
      handleMainImageChange(prevIndex);
    }
  };

  // ✅ SƏBƏTƏ ƏLAVƏ ET
  const handleAddToCart = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToCart({ 
        productId: product._id, 
        quantity: quantity 
      }).unwrap();
      toast.success("Məhsul səbətə əlavə edildi!");
    } catch (error) {
      toast.error("Məhsulu səbətə əlavə edərkən xəta baş verdi!");
    }
  };

  // ✅ FAVORİTLƏRƏ ƏLAVƏ ET
  const handleAddToFavorites = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToFavorites(product._id).unwrap();
      toast.success("Məhsul favorilərə əlavə edildi!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Məhsulu favorilərə əlavə edərkən xəta baş verdi!"
      );
    }
  };

  // ❤️ Şəkil üstündəki HEART icon
  const handleFavoriteIconClick = async (e) => {
    e.stopPropagation();
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    try {
      await addToFavorites(product._id).unwrap();
      toast.success("Məhsul favorilərə əlavə edildi!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Məhsulu favorilərə əlavə edərkən xəta baş verdi!"
      );
    }
  };

  // ✅ İNDİ AL
  const handleBuyNow = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error("Məhsul stokda qalmayıb!");
      return;
    }

    setIsBuyingNow(true);
    try {
      await addToCart({ 
        productId: product._id, 
        quantity: quantity 
      }).unwrap();
      
      toast.success("Məhsul səbətə əlavə edildi! Sifariş səhifəsinə yönləndirilirsiniz...");
      // navigate('/checkout');
    } catch (error) {
      toast.error("Xəta baş verdi!");
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Build breadcrumb dynamically
  const breadcrumbs = useMemo(() => {
    const items = [
      { label: 'Ana səhifə', path: '/' },
      { label: 'Kataloq', path: '/catalog' }  // Değiştirildi: 'catalog' -> 'Kataloq'
    ];

    if (product?.category) {
      const category = categories.find(cat => cat.name === product.category);
      if (category && category.slug) {
        items.push({
          label: product.category,
          path: `/catalog/${category.slug}`
        });

        if (product?.subcategory) {
          const subcategory = category.subcategories?.find(
            sub => sub.name === product.subcategory
          );
          if (subcategory && subcategory.slug) {
            items.push({
              label: product.subcategory,
              path: `/catalog/${category.slug}/${subcategory.slug}`
            });
          } else {
            items.push({
              label: product.subcategory,
              path: null
            });
          }
        }
      } else {
        items.push({
          label: product.category,
          path: null
        });
      }
    }

    items.push({
      label: product?.name || 'Product',
      path: null
    });

    return items;
  }, [product, categories]);

  // "Go back" button üçün dinamik mətn
  const getGoBackText = () => {
    if (product?.subcategory && product?.category) {
      const category = categories.find(cat => cat.name === product.category);
      if (category) {
        return `go back to ${category.name}`;
      }
    } else if (product?.category) {
      return "go back to all categories";
    }
    return "";
  };

  const goBackPath = () => {
    if (product?.subcategory && product?.category) {
      const category = categories.find(cat => cat.name === product.category);
      if (category && category.slug) {
        return `/catalog/${category.slug}`;
      }
    } else if (product?.category) {
      return "/catalog";
    }
    return "/catalog";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Məhsul tapılmadı.
      </div>
    );
  }

  const productImages = product?.images || [{ url: activeImg }];

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <section className="py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-screen-xl px-3 sm:px-4 md:px-6 mx-auto 2xl:px-0">
          {/* Custom Breadcrumbs */}
          <CustomBreadcrumb items={breadcrumbs} />

          {/* Go Back Button */}
          {getGoBackText() && (
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => {
                  navigate(goBackPath());
                }}
                className="text-sm text-[#5C4977] hover:underline flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {getGoBackText()}
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
              
              {/* LEFT COLUMN - IMAGE GALLERY */}
              <div className="shrink-0 max-w-full lg:max-w-none flex flex-col lg:flex-row gap-4 md:gap-6">
                {/* Thumbnails - VERTICAL */}
                <div className="lg:w-24 xl:w-28 order-2 lg:order-1">
                  <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:h-[500px] lg:overflow-x-hidden py-2 lg:py-0">
                    {productImages.map((img, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleMainImageChange(index)}
                        className={`flex-shrink-0 cursor-pointer w-16 h-16 md:w-20 md:h-20 lg:w-full lg:h-20 border-2 rounded-lg p-1 transition-all duration-200 bg-white ${
                          mainImageIndex === index 
                            ? 'border-[#5C4977] shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-contain rounded-md" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Image Container */}
                <div className="flex-1 order-1 lg:order-2 relative">
                  {/* Main Image with Navigation */}
                  <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                    {/* Product Labels */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      {product?.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          New
                        </span>
                      )}
                      {product?.isHot && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          HOT
                        </span>
                      )}
                    </div>
                    
                    {/* Favorite Heart Icon */}
                    <button 
                      className="absolute top-3 right-3 z-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                      onClick={handleFavoriteIconClick}
                      disabled={isAddingToFavorites}
                    >
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isAddingToFavorites ? 'text-gray-300' : 'text-gray-400 hover:text-red-500'}`} />
                    </button>

                    {/* Zoom Button */}
                    <button className="absolute bottom-3 right-3 z-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:bg-white transition-all duration-300">
                      <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-[#5C4977]" />
                    </button>

                    {/* Main Image */}
                    <div className="aspect-square w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                      <img
                        className="w-full h-full max-h-[400px] sm:max-h-[450px] md:max-h-[500px] object-contain transition-all duration-300"
                        src={activeImg}
                        alt={product?.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg";
                        }}
                      />
                    </div>

                    {/* Navigation Arrows */}
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={mainImageIndex === 0}
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={mainImageIndex === productImages.length - 1}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image Counter & Enlarge Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {mainImageIndex + 1} / {productImages.length}
                    </div>
                    
                    <button className="flex items-center gap-1.5 text-sm text-[#5C4977] hover:text-[#4a3c62] transition-colors font-medium">
                      <ZoomIn className="w-4 h-4" />
                      Click to enlarge
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - DETAILS */}
              <div className="mt-6 lg:mt-0">
                {/* Title */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {product?.name || "Product Name"}
                  </h1>
                </div>

                {/* Brand & Model */}
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  {product?.brand && (
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded">Brand: {product.brand}</span>
                  )}
                  {product?.model && (
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded">Model: {product.model}</span>
                  )}
                </div>

                {/* Reviews & SKU */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={product?.ratings || 5} />
                    <span className="ml-1 text-xs sm:text-sm text-gray-500">
                      ({product?.numOfReviews || 1} customer review)
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    SKU: <span className="text-gray-900 font-medium">
                      {product?._id?.substring(0,6) || "397707"}
                    </span>
                  </div>
                </div>

                {/* Promo Banner */}
                <div className="mt-4 sm:mt-6 bg-blue-600 text-white rounded-lg p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">Apple Shopping Event</p>
                      <p className="text-xs text-blue-100">Hurry and get discounts on all Apple devices up to 20%</p>
                    </div>
                  </div>
                  <button className="bg-white text-blue-600 text-xs sm:text-sm font-bold px-3 py-1.5 rounded hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Sale_coupon_15
                  </button>
                </div>

                {/* Price & Stock */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5C4977]">
                    {product?.price?.toFixed(2) || "50,00"} <span className="text-lg sm:text-xl md:text-2xl">₼</span>
                  </p>
                  {isOutOfStock ? (
                    <span className="px-3 py-1 text-xs sm:text-sm font-medium text-red-700 bg-red-100 rounded-full w-fit">
                      Out of stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-full border border-green-200 flex items-center gap-1 w-fit">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div> In stock
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {product?.description || "No description available."}
                  </p>
                </div>

                {/* Quantity & Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-auto bg-white">
                    <button 
                      onClick={() => handleQuantityChange('dec')} 
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-l-lg"
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      value={quantity} 
                      readOnly 
                      className="w-10 sm:w-12 text-center border-none focus:ring-0 text-gray-900 font-medium bg-transparent" 
                    />
                    <button 
                      onClick={() => handleQuantityChange('inc')} 
                      className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isOutOfStock}
                    className="flex-1"
                  >
                    {isAddingToCart ? "Əlavə edilir..." : "Səbətə əlavə et"}
                  </Button>

                  {/* Favoritlər */}
                  <Button
                    onClick={handleAddToFavorites}
                    disabled={isAddingToFavorites}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    {isAddingToFavorites ? "Əlavə edilir..." : "Favorilərə əlavə et"}
                  </Button>

                  {/* Buy Now */}
                  <Button
                    onClick={handleBuyNow}
                    disabled={isBuyingNow || isOutOfStock}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isBuyingNow ? "İşlənir..." : "İndi Al"}
                  </Button>
                </div>

                {/* Meta Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-[#5C4977] transition-colors cursor-pointer">
                    <GitCompare className="w-4 h-4" />
                    Add to compare
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-[#5C4977] transition-colors cursor-pointer"
                    onClick={handleAddToFavorites}
                  >
                    <Heart className="w-4 h-4" />
                    Add to wishlist
                  </button>
                </div>

                {/* Watching Notification */}
                <div className="mt-4 sm:mt-6 bg-gray-50 p-3 rounded-lg text-xs sm:text-sm text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <strong>19</strong> People watching this product now!
                </div>

                {/* Social Sharing */}
                <div className="mt-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Share:</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                      <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="X (Twitter)">
                      <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="#" className="text-gray500 hover:text-red-600 transition-colors" aria-label="Pinterest">
                      <FaPinterest className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                      <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-[#5C4977] transition-colors" aria-label="Email">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg divide-y divide-gray-200">
                  <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">🚚</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Pick up from the Woodmart Store</p>
                        <p className="text-xs text-gray-500">To pick up today</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                  </div>
                  
                  <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">📦</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Courier delivery</p>
                        <p className="text-xs text-gray-500">Our courier will deliver to the specified address</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">2-3 Days</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-100 rounded-full flex items-center justify-center text-[8px] font-bold text-red-600">
                        DHL
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">DHL Courier delivery</p>
                        <p className="text-xs text-gray-500">DHL courier will deliver to the specified address</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">2-3 Days</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">Free</span>
                    </div>
                  </div>
                </div>

                {/* Warranty & Returns */}
                <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="font-medium text-gray-900">Warranty 1 year</span>
                    </div>
                    <a href="#" className="text-[#5C4977] text-xs hover:underline font-medium">More details</a>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">↻</span>
                      </div>
                      <span className="font-medium text-gray-900">Free 30-Day returns</span>
                    </div>
                    <a href="#" className="text-[#5C4977] text-xs hover:underline font-medium">More details</a>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">We accept:</p>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="w-10 h-6 sm:w-12 sm:h-7 bg-blue-600 rounded flex items-center justify-center p-1">
                      <SiVisa className="w-full h-full text-white" />
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-7 bg-red-600 rounded flex items-center justify-center p-1">
                      <SiMastercard className="w-full h-full text-white" />
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-7 bg-indigo-600 rounded flex items-center justify-center p-1">
                      <span className="text-white text-xs font-bold">STRIPE</span>
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-7 bg-black rounded flex items-center justify-center p-1">
                      <FaApplePay className="w-full h-full text-white" />
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-7 bg-gray-100 rounded flex items-center justify-center p-1 border border-gray-300">
                      <FaGooglePay className="w-full h-full text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;