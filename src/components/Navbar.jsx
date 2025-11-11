import { useState } from "react";
import { Search, Menu, X, Phone, Globe, User, Heart, ShoppingCart, Repeat2, ChevronDown } from "lucide-react"

export default function MetaShopHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="w-full bg-white">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-xl font-bold">
                <span className="text-purple-900">META</span>
                <span className="text-red-600">SHOP</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2.5 pl-10 bg-gray-100 rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="text-gray-700 text-sm font-medium">24 Support</div>
                  <div className="text-blue-600 text-xs">+1 212-334-0212</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="text-gray-700 text-sm font-medium">Worldwide</div>
                  <div className="text-blue-600 text-xs">Free Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              {/* Left Navigation */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-[#5C4977] text-white px-4 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors text-sm font-medium">
                  <Menu className="w-4 h-4" />
                  <span>All Categories</span>
                </button>
                
                <nav className="flex items-center gap-4">
                  {['Promotions', 'Stores', 'Our Contacts', 'Delivery & Return', 'Outlet'].map((item) => (
                    <a 
                      key={item}
                      href="#" 
                      className="px-2 py-2 rounded-lg transition-colors hover:text-[#5C4977] hover:bg-[#5C4977]/5 text-sm font-medium"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              
              {/* Right Icons */}
              <div className="flex items-center gap-4">
                {[
                  { icon: User, label: 'Profile', count: null },
                  { icon: Repeat2, label: 'Compare', count: 0 },
                  { icon: Heart, label: 'Wishlist', count: 0 },
                  { icon: ShoppingCart, label: 'Cart', count: 0, active: true }
                ].map(({ icon: Icon, label, count, active }) => (
                  <button 
                    key={label}
                    className={`flex flex-col items-center transition-colors p-1.5 rounded-lg hover:bg-[#5C4977]/5 relative ${
                      active ? 'text-[#5C4977]' : 'text-gray-500 hover:text-[#5C4977]'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-0.5" />
                    <span className="text-xs font-medium">{label}</span>
                    {count !== null && (
                      <span className="absolute -top-1 -right-1 bg-[#5C4977] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="px-4 py-1.5 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">+994 12 310 10 10</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">Free Shipping</span>
            </div>
          </div>
        </div>

        {/* Main Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="text-lg font-bold">
                <span className="text-purple-900">META</span>
                <span className="text-red-600">SHOP</span>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-gray-600 hover:text-purple-900"
                >
                  <Search className="w-5 h-5" />
                </button>

             

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1.5 text-gray-600 hover:text-purple-900"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Search Bar - Toggleable */}
            {isSearchOpen && (
              <div className="mt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Məhsul axtar..."
                    className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
              <div className="text-lg font-bold">
                <span className="text-purple-900">META</span>
                <span className="text-red-600">SHOP</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
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
                <button className="flex items-center justify-between w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50">
                  <span>Bütün Kateqoriyalar</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                <div className="bg-gray-50">
                  {[
                    "Smartfonlar & Telefonlar",
                    "Noutbuklar & Kompüterlər",
                    "Televizorlar & Audio",
                    "Qadırğalar & Məişət texnikası",
                    "Oyun konsolları",
                    "Aksesuarlar",
                    "Smart saatlar & Fitnes brelokları",
                    "Foto & Video"
                  ].map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:text-purple-900 border-b border-gray-200"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>

              {/* Main Menu Items */}
              <div className="border-b border-gray-200">
                {[
                  "Aksiyalar",
                  "Mağazalar",
                  "Bizimlə Əlaqə",
                  "Çatdırılma & Geri Qaytarılma",
                  "Outlet",
                  "Brendlər",
                  "Xidmətlər",
                  "Korporativ satış"
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-200"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Additional Links */}
              <div className="px-4 py-3">
                <div className="space-y-2">
                  {["Çatdırılma şərtləri", "Geri qaytarılma şərtləri", "Kredit", "Zəmanət"].map((link) => (
                    <a key={link} href="#" className="block text-sm text-gray-600 hover:text-purple-900">
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">24/7 Dəstək</div>
                      <div className="text-xs text-blue-600">+994 12 310 10 10</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    © 2024 MetaShop. Bütün hüquqlar qorunur.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
  <div className="flex items-center justify-around py-1.5">
    {[
      { icon: 'home', label: 'Ana səhifə', active: true },
      { icon: 'products', label: 'Məhsullar' },
      { icon: 'cart', label: 'Səbət' },
      { icon: 'wishlist', label: 'Seçilmiş' },
      { icon: 'user', label: 'Hesab' }
    ].map(({ icon, label, active }) => (
      <button key={label} className={`flex flex-col items-center ${active ? 'text-purple-900' : 'text-gray-500'}`}>
        {icon === 'home' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        )}
        {icon === 'products' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )}
        {icon === 'cart' && <ShoppingCart className="w-5 h-5" />}
        {icon === 'wishlist' && <Heart className="w-5 h-5" />}
        {icon === 'user' && <User className="w-5 h-5" />}
        <span className="text-xs mt-0.5">{label}</span>
      </button>
    ))}
  </div>
</div>
      </div>
    </div>
  )
}