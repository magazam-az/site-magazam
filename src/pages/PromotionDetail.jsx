import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPromotionDetailsQuery } from '../redux/api/promotionApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';
import Product from '../components/Product';

const PromotionDetail = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetPromotionDetailsQuery(slug || '');
  const promotion = data?.promotion;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer
  useEffect(() => {
    if (!promotion?.endDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(promotion.endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [promotion?.endDate]);

  // Tarix formatla
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
    const startDay = start.getDate();
    const startMonth = months[start.getMonth()];
    const endDay = end.getDate();
    const endMonth = months[end.getMonth()];
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400 mb-4"></div>
          <p className="text-gray-600 font-semibold text-xl">Yüklənir...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <p className="text-red-600 mb-4">Promotion tapılmadı.</p>
          <Link to="/promotions" className="text-[#5C4977] hover:underline">
            Promotion-lara qayıt
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Promosiyalar", path: "/promotions" },
                { label: promotion.title }
              ]}
            />
          </div>

          {/* Promotion Banner */}
          <div className="bg-[#1C61E7] rounded-lg shadow-lg overflow-hidden mb-8 py-6 md:py-8 px-8 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-center">
              {/* Sol tərəf - Məzmun */}
              <div className="text-white pl-2 md:pl-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 pt-6">
                  {promotion.bigTitle || promotion.title}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-5 pt-0.5">
                  {formatDateRange(promotion.startDate, promotion.endDate)}
                </p>

                {/* Countdown Timer */}
                <div className="flex gap-3 md:gap-4 mb-5">
                  <div className="bg-[#FFFFFF] rounded-lg w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-sm">
                    <div className="text-xl md:text-2xl font-bold text-black leading-tight">{timeLeft.days}</div>
                    <div className="text-xs text-gray-500 -mt-0.5">days</div>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-lg w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-sm">
                    <div className="text-xl md:text-2xl font-bold text-black leading-tight">{timeLeft.hours}</div>
                    <div className="text-xs text-gray-500 -mt-0.5">hr</div>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-lg w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-sm">
                    <div className="text-xl md:text-2xl font-bold text-black leading-tight">{timeLeft.minutes}</div>
                    <div className="text-xs text-gray-500 -mt-0.5">min</div>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-lg w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-sm">
                    <div className="text-xl md:text-2xl font-bold text-black leading-tight">{timeLeft.seconds}</div>
                    <div className="text-xs text-gray-500 -mt-0.5">sc</div>
                  </div>
                </div>
              </div>

              {/* Sağ tərəf - Şəkil */}
              {promotion.detailImage?.url && (
                <div className="w-full h-60 md:h-72 lg:h-80 overflow-hidden rounded-lg pr-2 md:pr-4">
                  <img
                    src={promotion.detailImage.url}
                    alt={promotion.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Məhsullar bölməsi */}
          {promotion.products && promotion.products.length > 0 && (
            <div className="mb-8 mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {promotion.productTitle || "Special Offer from Mega electronics"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {promotion.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PromotionDetail;
