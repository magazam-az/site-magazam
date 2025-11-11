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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-2xl font-bold">
                <span className="text-purple-900">META</span>
                <span className="text-red-600">SHOP</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-full text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-gray-700 text-base font-medium">24 Support</div>
                    <div className="text-blue-600 text-sm">+1 212-334-0212</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gray-700" />
                  <div>
                    <div className="text-gray-700 text-base font-medium">Worldwide</div>
                    <div className="text-blue-600 text-sm">Free Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Left Navigation */}
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 bg-[#5C4977] text-white px-6 py-3 rounded-lg hover:bg-[#5C4977]/90 transition-all duration-300 shadow shadow-[#5C4977]/30 hover:shadow-md hover:shadow-[#5C4977]/40 border border-[#5C4977] text-base">
                  <Menu className="w-5 h-5" />
                  <span className="font-medium">All Categories</span>
                </button>
                
                <nav className="flex items-center gap-6">
                  <a 
                    href="#" 
                    className="px-3 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/20 text-base font-medium"
                  >
                    Promotions
                  </a>
                  <a 
                    href="#" 
                    className="px-3 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/20 text-base font-medium"
                  >
                    Stores
                  </a>
                  <a 
                    href="#" 
                    className="px-3 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/20 text-base font-medium"
                  >
                    Our Contacts
                  </a>
                  <a 
                    href="#" 
                    className="px-3 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/20 text-base font-medium"
                  >
                    Delivery & Return
                  </a>
                  <a 
                    href="#" 
                    className="px-3 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-sm hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/20 text-base font-medium"
                  >
                    Outlet
                  </a>
                </nav>
              </div>
              
              {/* Right Icons */}
              <div className="flex items-center gap-6">
                {/* Profile */}
                <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg hover:bg-[#5C4977]/5">
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Profile</span>
                </button>

                {/* Compare */}
                <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg hover:bg-[#5C4977]/5">
                  <Repeat2 className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Compare</span>
                </button>

                {/* Wishlist */}
                <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200 p-2 rounded-lg hover:bg-[#5C4977]/5">
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Wishlist</span>
                </button>

                {/* Cart */}
                <button className="flex flex-col items-center text-[#5C4977] transition-colors duration-200 p-2 rounded-lg hover:bg-[#5C4977]/5">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Bar */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="px-4 py-2 flex justify-between items-center text-xs">
            {/* Left side - Phone */}
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">+994 12 310 10 10</span>
            </div>
            
            {/* Right side - Shipping */}
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-700" />
              <span className="text-blue-600">Free Shipping</span>
            </div>
          </div>
        </div>

        {/* Main Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="text-xl font-bold">
                  <span className="text-purple-900">META</span>
                  <span className="text-red-600">SHOP</span>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                {/* Search Button */}
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart Button */}
                <button className="p-2 text-gray-600 hover:text-purple-900">
                  <ShoppingCart className="w-5 h-5" />
                </button>

                {/* Menu Toggle */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-purple-900"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Search Bar - Toggleable */}
            {isSearchOpen && (
              <div className="mt-3">
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
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-lg font-bold">
                <span className="text-purple-900">META</span>
                <span className="text-red-600">SHOP</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600"
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
                <button className="flex items-center justify-between w-full px-4 py-4 text-left font-medium text-gray-900 hover:bg-gray-50">
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
                  ].map((category, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-purple-900 border-b border-gray-200"
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
                ].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-200"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Additional Links */}
              <div className="px-4 py-4">
                <div className="space-y-3">
                  <a href="#" className="block text-sm text-gray-600 hover:text-purple-900">
                    Çatdırılma şərtləri
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-purple-900">
                    Geri qaytarılma şərtləri
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-purple-900">
                    Kredit
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-purple-900">
                    Zəmanət
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                <div className="space-y-3">
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
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center text-purple-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Ana səhifə</span>
            </button>

            <button className="flex flex-col items-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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