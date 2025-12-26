import React, { useState, useEffect } from 'react';
import { useGetShoppingEventQuery } from '../redux/api/shoppingEventApi';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const CountdownBox = ({ value, label }) => (
  <div className="bg-white rounded-md p-1 sm:p-1.5 w-10 h-10 sm:w-12 sm:h-12 text-center shadow-sm flex flex-col items-center justify-center">
    <span className="text-lg sm:text-xl font-bold text-gray-700 block leading-tight">{value}</span>
    <span className="text-[8px] sm:text-[9px] uppercase text-gray-500 leading-tight">{label}</span>
  </div>
);

const ShoppingEvent = () => {
  const { data: shoppingEventData, isLoading } = useGetShoppingEventQuery();
  const shoppingEvent = shoppingEventData?.shoppingEvent;

  // Geri sayım rəqəmləri və düymə üçün xüsusi rəng (şəkildəki bənövşəyi rəngə oxşar)
  const ACCENT_COLOR_CLASS = "text-[#705096]"; // Məsələn, biraz daha tünd bənövşəyi
  const BUTTON_BG_COLOR = "bg-[#705096]"; // Düymənin arxa plan rəngi
  const BUTTON_HOVER_COLOR = "hover:bg-[#705096]/90";

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!shoppingEvent?.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(shoppingEvent.endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [shoppingEvent?.endDate]);

  // Əgər loading-dirsə və ya aktiv deyilsə, göstərmə
  if (isLoading || !shoppingEvent || !shoppingEvent.isActive) {
    return null;
  }

  const backgroundImageUrl = shoppingEvent.backgroundImage?.url || '/images/apple-shopping.jpg';
  const deviceImageUrl = shoppingEvent.deviceImage?.url || '/images/ipad-section/iosmodels.webp';

  return (
    // Outer container: Apple shopping image background
    <div className="p-3 sm:p-6 md:p-8 font-lexend-deca relative" style={{
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      
      {/* 💻 Main Apple Shopping Event Section */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center rounded-xl py-3 sm:py-4 md:py-6 mb-0 max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 relative z-10"
      >
        
        {/* 🖼️ Şəkil bloku: Apple cihazlarının şəklinin arxa planı da əsas gradientin bir hissəsidir */}
        <div className="mb-4 sm:mb-6 md:mb-0 md:mr-8 lg:mr-12 w-full md:w-auto flex justify-center">
          <div className="w-full max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl h-32 sm:h-40 md:h-64 lg:h-80 xl:h-96 flex items-center justify-center overflow-hidden">
            <img 
              src={deviceImageUrl} 
              alt="Apple Devices" 
              className="object-contain w-full h-full" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/800x600/6B7280/ffffff?text=Apple+Devices";
              }}
            />
          </div>
        </div>

        {/* 📝 Mətn bloku */}
        <div className="text-center md:text-left w-full md:max-w-md lg:max-w-xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-2 sm:mb-3 md:mb-4">
            {shoppingEvent.title || "Apple Shopping Event"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4 md:mb-6">
            {shoppingEvent.description || "Hurry and get discounts on all Apple devices up to 20%"}
          </p>

          {/* ⏱️ Geri Sayım Taymeri */}
          <div className="flex justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <CountdownBox value={countdown.days.toString().padStart(2, '0')} label="Days" />
            <CountdownBox value={countdown.hours.toString().padStart(2, '0')} label="Hr" />
            <CountdownBox value={countdown.minutes.toString().padStart(2, '0')} label="Min" />
            <CountdownBox value={countdown.seconds.toString().padStart(2, '0')} label="Sc" />
          </div>

          {/* 🛍️ Alış-veriş düyməsi */}
          <Link to="/catalog">
            <button 
              className={`flex items-center justify-center mx-auto md:mx-0 px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base ${BUTTON_BG_COLOR} text-white font-semibold rounded-lg shadow-lg ${BUTTON_HOVER_COLOR} transition-colors duration-300 cursor-pointer`}
            >
              {shoppingEvent.buttonText || "Go Shopping"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* 📦 Məhsul Vitrini Bölməsi: Grid sütunları minimum 2 (kiçik), 3 (orta), 5 (böyük) */}
      {shoppingEvent.selectedProductIds && shoppingEvent.selectedProductIds.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 mt-4 sm:mt-6 md:-mt-2">
          {/* Məhsul Kartları - Dinamik */}
          {shoppingEvent.selectedProductIds.map((product) => {
            const productImage = product.images?.[0]?.url || product.image || "https://placehold.co/200x200/6B7280/ffffff?text=Product";
            const productPrice = typeof product.price === 'number' 
              ? `${product.price.toFixed(2)} ₼` 
              : product.price || "0.00 ₼";
            const productRating = product.rating || product.ratings || 5;

            return (
              <Link key={product._id} to={`/product/${product.slug || product._id}`}>
                <div className="bg-white rounded-xl p-2 sm:p-3 md:p-4 shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 flex items-center gap-2 sm:gap-3 cursor-pointer">
                  {/* Şəkil Konteyneri - Solda */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                    <img 
                      src={productImage} 
                      alt={product.name} 
                      className="object-contain max-h-full max-w-full p-1 sm:p-2" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/200x200/6B7280/ffffff?text=Product";
                      }}
                    />
                  </div>
                  
                  {/* Özellikler - Sağda */}
                  <div className="flex-1 min-w-0">
                    {/* Ad */}
                    <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 truncate mb-0.5 sm:mb-1">
                      {product.name}
                    </p>
                    
                    {/* Ulduz Reytinqi */}
                    <div className="mb-0.5 sm:mb-1">
                      <Rating rating={productRating} />
                    </div>
                    
                    {/* Qiymət */}
                    <p className={`text-[10px] sm:text-xs md:text-sm ${ACCENT_COLOR_CLASS} font-semibold`}>
                      {productPrice}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShoppingEvent;

