import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Rating from './Rating';
import { useAddToCartMutation } from '../redux/api/productsApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getFavorites, addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from '../utils/favorites';

// Product Card Component
const Product = ({ product, mehsul }) => {
  // mehsul və ya product prop-unu dəstəklə
  const productData = product || mehsul;
  
  // Əgər productData yoxdursa, heç nə göstərmə
  if (!productData) {
    return null;
  }
  
  const { isAuthenticated } = useSelector((state) => state.user || {});
  const navigate = useNavigate();
  
  const [addToCart] = useAddToCartMutation();
  
  // Product ID'yi bul - sadece _id veya id kabul et (sku kabul etme çünkü backend'de çalışmaz)
  const productId = productData._id || productData.id;
  const hasValidId = !!productId;
  
  // Stok kontrolü
  const isOutOfStock = (productData.inStock !== undefined && !productData.inStock) || (productData.stock !== undefined && productData.stock <= 0);
  
  // Ürünün favorilerde olup olmadığını kontrol et (localStorage'dan)
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (productId) {
      setIsFavorite(checkIsFavorite(productId));
    }
  }, [productId]);
  
  // localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      if (productId) {
        setIsFavorite(checkIsFavorite(productId));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event için de dinle (aynı tab'deki değişiklikler için)
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, [productId]);
  
  // Heart icon click handler
  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasValidId) {
      toast.error('Bu məhsul favorilərə əlavə edilə bilməz');
      return;
    }
    
    try {
      if (isFavorite) {
        removeFromFavorites(productId);
        setIsFavorite(false);
        toast.success('Məhsul favorilərdən silindi!');
      } else {
        addToFavorites(productId);
        setIsFavorite(true);
        toast.success('Məhsul favorilərə əlavə edildi!');
      }
      // Custom event gönder (aynı tab'deki diğer componentler için)
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      toast.error('Xəta baş verdi!');
      console.error('Favorites error:', error);
    }
  };

  // Səbətə əlavə et handler
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasValidId) {
      toast.error('Bu məhsul səbətə əlavə edilə bilməz');
      return;
    }
    
    // Login olmayanda login səhifəsinə yönləndir
    if (!isAuthenticated) {
      toast.error('Səbətə əlavə etmək üçün giriş yapmalısınız');
      navigate('/login');
      return;
    }
    
    if (isOutOfStock) {
      toast.error('Məhsul stokda qalmayıb!');
      return;
    }
    
    try {
      await addToCart({ 
        productId: productId, 
        quantity: 1 
      }).unwrap();
      toast.success('Məhsul səbətə əlavə edildi!');
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Məhsulu səbətə əlavə edərkən xəta baş verdi!';
      toast.error(errorMessage);
      console.error('Add to cart error:', error);
    }
  };

  // Product card click handler - navigate to product detail page
  const handleProductClick = (e) => {
    // Heart button'a tıklanırsa navigate etme
    if (e.target.closest('button')) {
      return;
    }
    
    if (hasValidId) {
      navigate(`/product/${productId}`);
    }
  };
  
  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-xl transition-all duration-300 flex flex-col p-3 sm:p-4 cursor-pointer w-full border border-gray-100 focus:outline-none relative product-card group"
      style={{ 
        minWidth: '100%',
        maxWidth: '100%'
      }}
    >
      {/* HOT badge */}
      {productData.isHot && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          HOT
        </div>
      )}
      
      {/* Heart icon - sadece geçerli ID varsa göster */}
      {hasValidId && (
        <button 
          onClick={handleHeartClick}
          className="absolute top-2 right-2 z-10 cursor-pointer focus:outline-none focus:ring-0 outline-none border-0 bg-transparent p-0 m-0"
          style={{ border: 'none', boxShadow: 'none' }}
        >
          <Heart 
            className={`w-7 h-7 transition-all duration-300 cursor-pointer hover:scale-110 ${
              isFavorite 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-400 hover:text-red-400'
            }`} 
            style={{ outline: 'none' }}
          />
        </button>
      )}
    
    {/* Məhsul Şəkili sahəsi - sabit ölçü */}
    <div className="w-full flex justify-center items-center mb-3 sm:mb-4 overflow-hidden" style={{ height: '200px' }}>
      <img 
        src={productData.imageUrl || productData.images?.[0]?.url || "https://placehold.co/234x234/6B7280/ffffff?text=Product+Image"} 
        alt={productData.imageAlt || productData.name} 
        className="object-contain w-full h-full max-w-[180px] max-h-[180px] sm:max-w-[234px] sm:max-h-[234px] transition-transform duration-300 ease-out hover:scale-110"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/234x234/6B7280/ffffff?text=Product+Image"; }}
      />
    </div>

    {/* Məhsul Məlumatı - sabit ölçü */}
    <div className="flex flex-col flex-grow text-left">
      <div className="mb-2 sm:mb-3 flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2">{productData.name}</h3>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-1 sm:mt-2 pl-1">{productData.brand}</p>
        <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-0.5 sm:mt-1 pl-1">{productData.model}</p>
        <div className="mt-1 sm:mt-2 pl-1">
          <Rating rating={productData.rating || productData.ratings || 5} />
        </div>
      </div>
      
      <div className="mt-auto">
        {/* Stok statusu */}
        <div className="flex items-center mb-1 sm:mb-2 pl-1">
          {!isOutOfStock ? (
            <span className="text-green-600 text-xs sm:text-sm flex items-center">
              <span className="mr-1">✔</span> Stokda var
            </span>
          ) : (
            <span className="text-red-600 text-xs sm:text-sm">Stokda bitib</span>
          )}
        </div>
        
        {/* Qiymət */}
        <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3 pl-1">
          {typeof productData.price === 'number' 
            ? `${productData.price.toFixed(2)} ₼` 
            : productData.price || '0.00 ₼'}
        </div>
        
        {/* Add to Cart button */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full text-white py-3 sm:py-3.5 md:py-4 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 mb-2 ${
            isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#5C4977] hover:bg-[#5C4977]/90 cursor-pointer'
          }`}
        >
          {isOutOfStock ? 'Stokda bitib' : 'Səbətə əlavə et'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Product;