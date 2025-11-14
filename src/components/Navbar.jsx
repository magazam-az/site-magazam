import { useState } from "react"
import { Search, Menu, X, Phone, Globe, User, Heart, ShoppingCart, ChevronDown } from "lucide-react"

export default function MetaShopHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const categories = [
    {
      name: "Smartfonlar, Planşet və Qadjetlər",
      subcategories: [
        "Smartfonlar",
        "Planşetlər",
        "Aksesuarlar",
        "Smart saatlar və fitnes-breloklar",
        "Qulaqlıqlar",
        "Powerbank-lər",
        "Telefon üçün ehtiyat hissələr",
      ],
    },
    {
      name: "Noutbuklar, Kompüterlər, Ofis",
      subcategories: [
        "Noutbuklar",
        "Kompüter toplamaq üçün komponentlər",
        "Monobloklar",
        "Monitorlar",
        "Aksesuarlar",
        "Printerlər və MFP-lər",
        "Proyektorlar",
        "Ofis avadanlıqları",
      ],
    },
    {
      name: "TV, Audio, Video, Foto",
      subcategories: [
        "Televizorlar",
        "Audio sistemlər",
        "Fotoaparatlar",
        "Video kameralar",
        "Objektivlər",
        "Foto aksesuarlar",
        "TV və audio aksesuarlar",
      ],
    },
    {
      name: "Məişət texnikası",
      subcategories: [
        "Soyuducular",
        "Paltaryuyan maşınlar",
        "Kondisionerlər",
        "Qaz plitələr",
        "Elektrik sobalar",
        "Mikrodalğalı sobalar",
        "Tozsoranlar",
        "Ütülər",
      ],
    },
    {
      name: "Oyun və Əyləncə",
      subcategories: [
        "Oyun konsolları",
        "Oyunlar",
        "Geyming aksesuarlar",
        "Virtual reallıq başlıqları",
        "Geyming stolları və kreslolar",
      ],
    },
    {
      name: "Şəbəkə avadanlıqları",
      subcategories: ["Routerlər", "Modemlər", "Wi-Fi adapterlər", "Şəbəkə saxlayıcıları", "İnternet kabeli"],
    },
  ]

  // Subkateqoriyalara klik zamanı
  const handleSubcategoryClick = (subcategoryName) => {
    // Burada sizin routing məntiqinizə uyğun hərəkət edə bilərsiniz
    console.log("Seçildi:", subcategoryName)
    
    // Dropdownları bağla
    setIsCategoriesOpen(false)
    setExpandedCategory(null)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="w-full bg-white">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white">
        {/* Main Header */}
        <div className="max-w-[1400px] mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/images/logo.svg" 
                alt="META SHOP Logo" 
                className="h-14 cursor-pointer"
              />
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Məhsul axtar..."
                  className="w-full px-5 py-2 pl-12 bg-white rounded-full text-base text-[#5c4977] placeholder-[#5c4977]/50 focus:outline-none focus:ring-2 focus:ring-[#5c4977] focus:bg-white transition-colors border border-[#5c4977]/30"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c4977]" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-black text-sm font-bold">24/7 Dəstək</div>
                    <div className="text-blue-600 text-sm">+994 12 310 10 10</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-black text-sm font-bold">Bütün ölkə üzrə</div>
                    <div className="text-blue-600 text-sm">Pulsuz çatdırılma</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-2">
              {/* Left Navigation */}
              <div className="flex items-center gap-6">
                {/* Categories Dropdown */}
            <div className="relative">
  {/* Baş düymə */}
  <div
    className="flex items-center gap-3 px-4 py-2 transition-all duration-300 cursor-pointer select-none"
    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
  >
    {/* Sol — Icon düymə */}
    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-[#5C4977] text-white hover:bg-[#5C4977]/90 transition-all duration-300 shadow-md shadow-[#5C4977]/30 hover:shadow-[#5C4977]/50 border border-[#5C4977] cursor-pointer">
      <Menu className="w-5 h-5 cursor-pointer" />
    </button>

    {/* Sağ — Yazı + Aşağı ox */}
    <div className="flex items-center gap-2">
      <span className="text-base font-medium text-[#5C4977] select-none cursor-pointer">Bütün Kateqoriyalar</span>
      <ChevronDown
        className={`w-4 h-4 text-[#5C4977]/70 transition-transform duration-300 cursor-pointer ${
          isCategoriesOpen ? "rotate-180" : ""
        }`}
      />
    </div>
  </div>

  {/* Aşağı açılan menyu */}
  {isCategoriesOpen && (
    <div
      className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-[#5C4977]/20 rounded-2xl mt-2 z-50 overflow-hidden transition-all duration-300"
    >
      <div className="p-4 max-h-96 overflow-y-auto">
        {categories.map((category, index) => (
          <div key={index} className="mb-2 last:mb-0">
            {/* Ana kateqoriya */}
            <button
              onClick={() =>
                setExpandedCategory(expandedCategory === index ? null : index)
              }
              className="flex items-center justify-between w-full p-3 hover:bg-[#f5f2fa] rounded-xl cursor-pointer group transition-all select-none"
            >
              <span className="font-medium text-[#5C4977] text-left flex-1 select-none">
                {category.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#5C4977]/60 transition-transform duration-300 ${
                  expandedCategory === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Subcategories */}
            {expandedCategory === index && (
              <div className="ml-4 mt-2 space-y-1">
                {category.subcategories.map((subcategory, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className="block w-full text-left px-3 py-2 text-sm text-[#5C4977]/80 hover:text-[#5C4977] hover:bg-[#f3effa] rounded-lg transition-all select-none"
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>


                <nav className="flex items-center gap-0">
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Aksiyalar
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Mağazalar
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Bizimlə Əlaqə
                  </button>
                  <button className="px-5 py-2 rounded-full transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border-none text-base font-medium cursor-pointer select-none">
                    Çatdırılma & Geri Qaytarılma
                  </button>
                </nav>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-6">
                <button className="flex items-center justify-center text-black hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg cursor-pointer">
                  <User className="w-6 h-6" />
                </button>

                <button className="relative flex items-center justify-center text-black hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg cursor-pointer">
                  <Heart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-[#5C4977] text-xs font-bold rounded-full border border-gray-300" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}>1</span>
                </button>

                <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#5C4977] hover:bg-[#5C4977]/90 transition-colors duration-200 cursor-pointer p-0">
                  <ShoppingCart className="w-5 h-5 text-white -ml-0.5" />
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-[#5C4977] text-xs font-bold rounded-full border border-gray-300" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}>1</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-2 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">+994 12 310 10 10</span>
            </div>

            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">Pulsuz çatdırılma</span>
            </div>
          </div>
        </div>

        {/* Main Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/images/logo.svg" 
                  alt="META SHOP Logo" 
                  className="h-10"
                />
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900"
                >
                  <Search className="w-5 h-5" />
                </button>

                <button className="p-2 text-gray-600 hover:text-purple-900">
                  <ShoppingCart className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
              <div className="mt-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Məhsul axtar..."
                    className="w-full px-4 py-3 pl-12 bg-white rounded-full text-base text-[#5c4977] placeholder-[#5c4977]/50 focus:outline-none focus:ring-2 focus:ring-[#5c4977] focus:bg-white transition-colors border border-[#5c4977]/30"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c4977]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <img 
                src="/images/logo.svg" 
                alt="META SHOP Logo" 
                className="h-8"
              />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-screen overflow-y-auto pb-20">
              {/* User Section */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <button className="flex items-center gap-3 w-full text-left">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-900" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Hesabıma daxil ol</div>
                    <div className="text-xs text-gray-500">Giriş və ya qeydiyyat</div>
                  </div>
                </button>
              </div>

              {/* Categories */}
              <div className="border-b border-gray-200">
                <button
                  className="flex items-center justify-between w-full px-4 py-4 text-left font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span>Bütün Kateqoriyalar</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                          className="flex items-center justify-between w-full px-6 py-3 text-left text-sm font-medium text-gray-900 hover:bg-white border-b border-gray-200"
                        >
                          <span>{category.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedCategory === index ? "rotate-180" : ""}`}
                          />
                        </button>

                        {expandedCategory === index && (
                          <div className="bg-white border-b border-gray-200">
                            {category.subcategories.map((subcategory, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => handleSubcategoryClick(subcategory)}
                                className="block w-full text-left px-8 py-3 text-sm text-gray-700 hover:text-purple-900 hover:bg-purple-50 border-b border-gray-100"
                              >
                                {subcategory}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Menu Items */}
              <div className="border-b border-gray-200">
                {["Aksiyalar", "Mağazalar", "Bizimlə Əlaqə", "Çatdırılma & Geri Qaytarılma", "Outlet"].map((item, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-4  text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center text-purple-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Ana səhifə</span>
            </button>

            <button className="flex flex-col items-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-xs mt-1">Məhsullar</span>
            </button>

            <button className="flex flex-col items-center text-gray-500">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs mt-1">Səbət</span>
            </button>

            <button className="flex flex-col items-center text-gray-500">
              <Heart className="w-5 h-5" />
              <span className="text-xs mt-1">Seçilmiş</span>
            </button>

            <button className="flex flex-col items-center text-gray-500">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Hesab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}