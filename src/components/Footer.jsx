import { Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 font-sans">
      
      {/* 📍 Mağaza Ünvanları Bölməsi */}
      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Broadway Mağazası */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span className="truncate">Broadway Mağazası</span>
              <span className="bg-blue-600 text-white rounded-full p-1 flex-shrink-0">
                {/* İrəli oxu simvolu */}
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">1260 Broadway, San Francisco, CA 94109</p>
          </div>

          {/* Valencia Mağazası */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span className="truncate">Valencia Mağazası</span>
              <span className="bg-blue-600 text-white rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">1501 Valencia St, San Francisco, CA 94110</p>
          </div>

          {/* Emeryville Mağazası */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span className="truncate">Emeryville Mağazası</span>
              <span className="bg-blue-600 text-white rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">1034 36th St, Emeryville, CA 94608</p>
          </div>

          {/* Alameda Mağazası */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span className="truncate">Alameda Mağazası</span>
              <span className="bg-blue-600 text-white rounded-full p-1 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">1433 High St, Alameda, CA 94501</p>
          </div>
        </div>
      </div>

      {/* 🖥️ Əsas Footer Məzmunu */}
      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Responsive Grid: Kiçik ekranlarda 1 sütun, orta ekranlarda 2, böyük ekranlarda 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 max-w-7xl mx-auto">
          
          {/* 🌳 WoodMart Bölməsi */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">{`{◀`}</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">WoodMart.</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-6">
              Condimentum adipiscing vel neque dis nam parturient orci at scelerisque.
            </p>

            {/* Abunə ol Bölməsi (Sosial Şəbəkələr) */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3">Bizə abunə olun</h4>
              <div className="flex flex-wrap gap-2">
                {/* Facebook */}
                <button className="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
                  <Facebook size={16} />
                </button>
                {/* Twitter */}
                <button className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <Twitter size={16} />
                </button>
                {/* Pinterest */}
                <button className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.937-.2-2.378.042-3.397.216-.937 1.402-5.938 1.402-5.938s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.768 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
                {/* LinkedIn */}
                <button className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <Linkedin size={16} />
                </button>
                {/* Telegram (Qeyd: Telegram ikonu üçün MessageCircle-dan istifadə edildi) */}
                <button className="w-9 h-9 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 🏷️ Kateqoriyalar Bölməsi */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Kateqoriyalar</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Smartfonlar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Noutbuklar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Avadanlıq
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Kameralar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Qulaqlıqlar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Vanna Otağı
                </a>
              </li>
            </ul>
          </div>

          {/* 🔗 Faydalı Keçidlər Bölməsi */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Faydalı Keçidlər</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Endirimlər
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Mağazalarımız
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Əlaqə
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Çatdırılma və Qaytarma
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Outlet
                </a>
              </li>
            </ul>
          </div>

          {/* 📜 Footer Menyu Bölməsi */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Əlavə Menyu</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Əlaqə
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Endirimlər
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Mağazalarımız
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm">
                  Çatdırılma və Qaytarma
                </a>
              </li>
            </ul>
          </div>

          {/* 📲 Mobil Tətbiqi Yüklə Bölməsi */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Tətbiqi Mobilə Yükləyin:</h4>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Bütün cihazlarınızda eksklüziv təkliflərdən yararlanın.
            </p>
            <div className="flex gap-3">
              {/* Google Play Düyməsi */}
              <a href="#" className="flex items-center">
                <img src="https://metashop.az/wp-content/uploads/2022/12/google-play.svg" alt="Google Play" className="w-auto h-9 sm:h-10" />
              </a>
              {/* App Store Düyməsi */}
              <a href="#" className="flex items-center">
                <img src="https://metashop.az/wp-content/uploads/2022/12/app-store.svg" alt="App Store" className="w-auto h-9 sm:h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ©️ Ən Aşağı Bölmə */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Müəllif Hüququ */}
          <p className="text-xs text-gray-600 order-2 md:order-1 text-center md:text-left">
            Müəllif hüquqları © 2025. <span className="font-semibold text-gray-900">WoodMart</span> teması əsasında.{" "}
            <span className="font-semibold text-gray-900">WooCommerce Temaları</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 order-1 md:order-2">
            {/* Dil Seçicisi */}
            <button className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  strokeWidth="2"
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                />
              </svg>
              <span className="whitespace-nowrap">Azərbaycan dili</span>
            </button>

            {/* Ödəniş İkonları */}
            <div>
              <img src="https://metashop.az/wp-content/themes/woodmart/images/payments.png" alt="Ödəniş üsulları" className="h-4 sm:h-5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}