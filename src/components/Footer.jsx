import { Facebook, Twitter, Linkedin, Loader2, Instagram } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useGetCategoriesQuery } from "../redux/api/categoryApi"
import { useGetSettingsQuery } from "../redux/api/settingsApi"

export default function Footer() {
  // Kategorileri API'den al
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.categories || []
  
  // Settings API'den sosyal medya linklerini al
  const { data: settingsData } = useGetSettingsQuery()
  const settings = settingsData?.settings || {}
  return (
    <footer className="bg-white text-gray-800 font-sans">
      
      {/* 🖥️ Əsas Footer Məzmunu */}
      <div className="border-b border-gray-200 py-8 sm:py-10 lg:py-12">
        {/* Responsive Grid: Kiçik ekranlarda 1 sütun, orta ekranlarda 2, böyük ekranlarda 4 */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* 🌳 MetaShop Bölməsi */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Link to="/" className="inline-block cursor-pointer">
                <img 
                  src="/images/logo.svg" 
                  alt="META SHOP Logo" 
                  className="h-10 cursor-pointer"
                />
              </Link>
            </div>

            {/* Abunə ol Bölməsi (Sosial Şəbəkələr) */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3">Bizə abunə olun</h4>
              <div className="flex flex-wrap gap-2">
                {/* Facebook */}
                {settings.facebook && (
                  <a 
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition cursor-pointer"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {/* Twitter */}
                {settings.twitter && (
                  <a 
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition cursor-pointer"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {/* Instagram */}
                {settings.instagram && (
                  <a 
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {/* LinkedIn */}
                {settings.linkedin && (
                  <a 
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {/* WhatsApp */}
                {settings.whatsappPhone && (
                  <a 
                    href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition cursor-pointer"
                  >
                    <FaWhatsapp size={16} />
                  </a>
                )}
                {/* YouTube */}
                {settings.youtube && (
                  <a 
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 🏷️ Kateqoriyalar Bölməsi */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Kateqoriyalar</h4>
            <ul className="space-y-2 sm:space-y-3">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((category) => {
                  const categorySlug = category.slug || encodeURIComponent(category.name)
                  return (
                    <li key={category._id}>
                      <Link 
                        to={`/catalog/${categorySlug}`} 
                        className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </li>
                  )
                })
              ) : (
                <li className="flex justify-center items-center py-2">
                  <Loader2 className="h-4 w-4 text-[#5C4977] animate-spin" />
                </li>
              )}
            </ul>
          </div>

          {/* 🔗 Faydalı Keçidlər Bölməsi */}
          <div>
            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4">Faydalı Keçidlər</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/promotions" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm cursor-pointer">
                  Aksiyalar
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm cursor-pointer">
                  Bütün Məhsullar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition text-xs sm:text-sm cursor-pointer">
                  Bizimlə Əlaqə
                </Link>
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
              <a href="#" className="flex items-center cursor-pointer">
                <img src="https://metashop.az/wp-content/uploads/2022/12/google-play.svg" alt="Google Play" className="w-auto h-9 sm:h-10" />
              </a>
              {/* App Store Düyməsi */}
              <a href="#" className="flex items-center cursor-pointer">
                <img src="https://metashop.az/wp-content/uploads/2022/12/app-store.svg" alt="App Store" className="w-auto h-9 sm:h-10" />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ©️ Ən Aşağı Bölmə */}
<div className="py-4 sm:py-5 bg-gray-50">
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

    {/* Sol tərəf - Müəllif Hüququ */}
    <p className="text-xs text-gray-600 text-center md:text-left font-semibold">
      Müəllif hüquqları qorunur © 2026
    </p>

    
    {/* Sağ - Ödəniş ikonları */}
    <div className="flex justify-center md:justify-end">
      <img
        src="https://metashop.az/wp-content/themes/woodmart/images/payments.png"
        alt="Ödəniş üsulları"
        className="h-4 sm:h-5"
      />
    </div>
  </div>
</div>

    </footer>
  )
}