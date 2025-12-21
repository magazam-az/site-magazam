import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import Rating from './Rating';
import { useAddToCartMutation } from '../redux/api/productsApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite as checkIsFavorite
} from '../utils/favorites';

// Product Card Component
const Product = ({ product, mehsul }) => {
  const productData = product || mehsul;
  if (!productData) return null;

  const { isAuthenticated } = useSelector((state) => state.user || {});
  const navigate = useNavigate();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // yalnız _id və ya id
  const productId = productData._id || productData.id;
  const hasValidId = !!productId;

  const isOutOfStock =
    (productData.inStock !== undefined && !productData.inStock) ||
    (productData.stock !== undefined && productData.stock <= 0);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (productId) setIsFavorite(checkIsFavorite(productId));
  }, [productId]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (productId) setIsFavorite(checkIsFavorite(productId));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, [productId]);

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
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      toast.error('Xəta baş verdi!');
      console.error('Favorites error:', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasValidId) {
      toast.error('Bu məhsul səbətə əlavə edilə bilməz');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.error('Məhsul stokda qalmayıb!');
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success('Məhsul səbətə əlavə edildi!');
    } catch (error) {
      const msg =
        error?.data?.message ||
        error?.message ||
        'Məhsulu səbətə əlavə edərkən xəta baş verdi!';
      toast.error(msg);
      console.error('Add to cart error:', error);
    }
  };

  // ✅ Mobil/touch üçün: tap vs swipe ayırd edirik (click udulsa belə işləyir)
  const pointerRef = useRef({
    x: 0,
    y: 0,
    moved: false,
    pointerId: null,
    isInteractiveElement: false
  });

  const shouldIgnoreNavigate = (target) => {
    // Kartın içindəki interaktiv elementlərə toxunanda navigate etməsin
    return !!target?.closest?.('button, a, input, textarea, select, label, [role="button"]');
  };

  const goToDetail = useCallback(() => {
    if (hasValidId) navigate(`/product/${productId}`);
  }, [hasValidId, productId, navigate]);

  const onPointerDown = (e) => {
    // Eğer interaktif bir elemente tıklandıysa, navigate işlemini engelle
    const isInteractive = shouldIgnoreNavigate(e.target);
    pointerRef.current.isInteractiveElement = isInteractive;
    
    // Eğer interaktif element ise, pointer event'lerini işleme
    if (isInteractive) {
      return;
    }

    pointerRef.current.x = e.clientX ?? 0;
    pointerRef.current.y = e.clientY ?? 0;
    pointerRef.current.moved = false;
    pointerRef.current.pointerId = e.pointerId;

    // pointer capture: swipe zamanı da event-ləri stabil saxlayır
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    // Eğer interaktif element ise, hareket etme
    if (pointerRef.current.isInteractiveElement) return;

    const dx = Math.abs((e.clientX ?? 0) - pointerRef.current.x);
    const dy = Math.abs((e.clientY ?? 0) - pointerRef.current.y);

    // 8px+ hərəkət -> swipe/drag say
    if (dx > 8 || dy > 8) pointerRef.current.moved = true;
  };

  const onPointerUp = (e) => {
    // Eğer interaktif element ise, navigate etme
    if (pointerRef.current.isInteractiveElement) {
      pointerRef.current.isInteractiveElement = false;
      return;
    }

    // swipe/drag olubsa açma
    if (pointerRef.current.moved) return;

    // interaktiv elementə toxunubsa açma (ek güvence)
    if (shouldIgnoreNavigate(e.target)) return;

    goToDetail();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (shouldIgnoreNavigate(e.target)) return;
      e.preventDefault();
      goToDetail();
    }
  };

  return (
    <div
      // ⚠️ onClick saxlamıram, çünki mobil bəzən click ümumiyyətlə atılmır
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      className="bg-white rounded-xl transition-all duration-300 flex flex-col p-3 sm:p-4 cursor-pointer w-full border border-gray-100 focus:outline-none relative product-card group"
      style={{
        minWidth: '100%',
        maxWidth: '100%',
        // mobil “ghost click” problemini azaldır
        touchAction: 'manipulation'
      }}
    >
      {productData.isHot && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          HOT
        </div>
      )}

      {hasValidId && (
        <button
          onClick={handleHeartClick}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10 cursor-pointer focus:outline-none focus:ring-0 outline-none border-0 bg-transparent p-0 m-0"
          style={{ border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-7 h-7 transition-all duration-300 cursor-pointer hover:scale-110 ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
            style={{ outline: 'none', pointerEvents: 'none' }}
          />
        </button>
      )}

      <div className="w-full flex justify-center items-center mb-3 sm:mb-4 overflow-hidden" style={{ height: '200px' }}>
        <img
          src={
            productData.imageUrl ||
            productData.images?.[0]?.url ||
            'https://placehold.co/234x234/6B7280/ffffff?text=Product+Image'
          }
          alt={productData.imageAlt || productData.name}
          className="object-contain w-full h-full max-w-[180px] max-h-[180px] sm:max-w-[234px] sm:max-h-[234px] transition-transform duration-300 ease-out hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/234x234/6B7280/ffffff?text=Product+Image';
          }}
        />
      </div>

      <div className="flex flex-col flex-grow text-left">
        <div className="mb-2 sm:mb-3 flex-grow">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2">
            {productData.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-1 sm:mt-2 pl-1">{productData.brand}</p>
          <p className="text-sm sm:text-base text-gray-400 line-clamp-1 mt-0.5 sm:mt-1 pl-1">{productData.model}</p>
          <div className="mt-1 sm:mt-2 pl-1">
            <Rating rating={productData.rating || productData.ratings || 5} />
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center mb-1 sm:mb-2 pl-1">
            {!isOutOfStock ? (
              <span className="text-green-600 text-xs sm:text-sm flex items-center">
                <span className="mr-1">✔</span> Stokda var
              </span>
            ) : (
              <span className="text-red-600 text-xs sm:text-sm">Stokda bitib</span>
            )}
          </div>

          <div className="text-base sm:text-lg font-bold text-[#5C4977] mb-2 sm:mb-3 pl-1">
            {typeof productData.price === 'number'
              ? `${productData.price.toFixed(2)} ₼`
              : productData.price || '0.00 ₼'}
          </div>

          <button
            onClick={handleAddToCart}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            disabled={isOutOfStock || isAddingToCart}
            className={`w-full text-white py-3 sm:py-3.5 md:py-4 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 mb-2 flex items-center justify-center ${
              isOutOfStock || isAddingToCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5C4977] hover:bg-[#5C4977]/90 cursor-pointer'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Əlavə olunur...</span>
              </>
            ) : (
              isOutOfStock ? 'Stokda bitib' : 'Səbətə əlavə et'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
