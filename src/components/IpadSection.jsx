import React from 'react';

const IpadSection = () => {
  // Əsas Apple Shopping Event hissəsinin şəkildəki yumşaq gradientinə uyğun rənglər
  const EVENT_BG_GRADIENT = "bg-gradient-to-r from-pink-100/50 via-purple-100/70 to-blue-100/50";
  // Geri sayım rəqəmləri və düymə üçün xüsusi rəng (şəkildəki bənövşəyi rəngə oxşar)
  const ACCENT_COLOR_CLASS = "text-[#705096]"; // Məsələn, biraz daha tünd bənövşəyi
  const BUTTON_BG_COLOR = "bg-[#705096]"; // Düymənin arxa plan rəngi
  const BUTTON_HOVER_COLOR = "hover:bg-[#705096]/90";

  return (
    // Outer container: Ümumi arxa planı açıq saxlamaq üçün yüngül gradient
    <div className="min-h-screen bg-gradient-to-br bg-gradient-to-r from-pink-100/50 via-purple-100/70 to-blue-100/50 p-4 sm:p-8 font-lexend-deca">
      
      {/* 💻 Main Apple Shopping Event Section */}
      <div 
        // Şəkildəki kimi gradient fonu tətbiq edilir, kənarları yumşaq (rounded-xl)
        className={`flex flex-col md:flex-row items-center justify-center rounded-xl p-6 sm:p-10 mb-12 max-w-7xl mx-auto`}
      >
        
        {/* 🖼️ Şəkil bloku: Apple cihazlarının şəklinin arxa planı da əsas gradientin bir hissəsidir */}
        <div className="mb-8 md:mb-0 md:mr-12 w-full md:w-auto flex justify-center">
          {/* Şəklin konteyneri artıq özü gradientə ehtiyac duymur, çünki valideyn element (yuxarıdakı div) gradientdir */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl h-56 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center overflow-hidden">
             {/* QEYD: Şəklin özünün bu gradientə uyğun olması üçün şəkil faylı PNG və ya şəkildəki kimi fonu şəffaf olan bir formatda olmalıdır */}
            <img 
              src="src/assets/images/ipad-section/iosmodels.webp" 
              alt="Apple Devices" 
              className="object-cover w-full h-full" 
            />
          </div>
        </div>

        {/* 📝 Mətn bloku */}
        <div className="text-center md:text-left w-full md:max-w-md lg:max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-2 sm:mb-4">
            Apple Shopping Event
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Hurry and get discounts on all Apple devices up to **20%**
          </p>

          {/* ⏱️ Geri Sayım Taymeri */}
          <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            {['Days', 'Hr', 'Min', 'Sc'].map((unit, index) => (
              // Arxa plan Ağ və Sərhəd (border) Əlavə Edilib (şəkildəki kimi daha dəqiq olması üçün)
              <div key={unit} className="bg-white p-2 sm:p-3 rounded-lg text-center shadow-md min-w-[50px] sm:min-w-[60px] border border-gray-200">
                {/* Rəqəmlər üçün ACCENT_COLOR_CLASS tətbiq edilir */}
                <div className={`text-xl sm:text-2xl font-bold ${ACCENT_COLOR_CLASS}`}>
                  {/* Rəqəmlər şəkildəki rəqəmlərə dəyişdirildi: 52 Days, 02 Hr, 51 Min, 07 Sc */}
                  {index === 0 ? '52' : index === 1 ? '02' : index === 2 ? '51' : '07'}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">{unit}</div>
              </div>
            ))}
          </div>

          {/* 🛍️ Alış-veriş düyməsi */}
          <button 
            // Düymənin rəngləri yeniləndi
            className={`flex items-center justify-center mx-auto md:mx-0 px-6 sm:px-8 py-2 sm:py-3 ${BUTTON_BG_COLOR} text-white font-semibold rounded-lg shadow-lg ${BUTTON_HOVER_COLOR} transition duration-300 transform hover:scale-[1.02]`}
          >
            Go Shopping
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* 📦 Məhsul Vitrini Bölməsi: Grid sütunları 2 (kiçik), 3 (orta), 5 (böyük) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
        
        {/* Məhsul Kartları - 3-5 arası ulduz reytinqi əlavə edildi */}
        {[
          { name: "Acer ProDesigner", price: "750,00 ₼", img: "src/assets/images/ipad-section/iosmodels.webp", rating: 4 },
          { name: "Acer SA100", price: "30,00 ₼", img: "src/assets/images/ipad-section/acerkart.webp", rating: 5 },
          { name: "Ailink Aluminium", price: "40,00 ₼", img: "src/assets/images/ipad-section/alim.webp", rating: 3 },
          { name: "Alogic Ultra Mini", price: "50,00 ₼", img: "src/assets/images/ipad-section/alagocig.webp", rating: 5 },
          { name: "AMD Radeon Pro", price: "480,00 ₼", img: "src/assets/images/ipad-section/amdpro.webp", rating: 4 },
        ].map((product, index) => (
          // Məhsul kartları: Ağ arxa plan və kölgə
          <div key={index} className="bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition duration-300 text-center border border-gray-200">
            {/* Şəkil Konteyneri */}
            <div className="w-full h-20 sm:h-24 bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-gray-100">
              <img 
                src={product.img} 
                alt={product.name} 
                className="object-contain max-h-full max-w-full p-2" 
              />
            </div>
            
            {/* Ad və Qiymət */}
            <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{product.name}</p>
            
            {/* Ulduz Reytinqi - 3-5 arası reytinq tətbiq edildi */}
            <div className="flex justify-center text-yellow-500 my-1 text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={star <= product.rating ? 'opacity-100' : 'opacity-30'}
                >
                  ★
                </span>
              ))}
            </div>
            
            {/* Qiymət üçün ACCENT_COLOR_CLASS tətbiq edilir */}
            <p className={`text-xs sm:text-sm ${ACCENT_COLOR_CLASS} font-semibold`}>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IpadSection;