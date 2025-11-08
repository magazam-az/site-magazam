"use client"

import { Heart, User, Repeat2, ShoppingCart, Search, Menu, Globe, Phone, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Info Bar - Hidden on mobile */}
      <div className="hidden lg:flex bg-gray-50 px-4 lg:px-6 py-2 justify-between items-center text-sm">
        <div className="flex gap-4 lg:gap-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">24 Support</span>
            <span className="text-[#5C4977] font-semibold ml-0 sm:ml-2">+1 212-334-0212</span>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Worldwide</span>
          </div>
          <span className="text-[#5C4977] font-semibold">Free Shipping</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-[#5C4977]">META</span>
              <span className="text-xl sm:text-2xl font-bold text-[#5C4977]">SHOP</span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2 border border-transparent hover:border-[#5C4977]/30 transition-all duration-300">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 ml-3 bg-transparent outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right Icons */}
          {/* Bu hissəyə masaüstü ikonlarını əlavə etmək lazım idi, lakin mobil naviqasiya əlavə edildiyi üçün burada boş qalsın. */}
        </div>

        {/* Navigation Menu - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-center gap-8 mt-4 max-w-7xl mx-auto">
          <button className="flex items-center gap-2 bg-[#5C4977] text-white px-4 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-all duration-300 shadow-lg shadow-[#5C4977]/30 hover:shadow-xl hover:shadow-[#5C4977]/40 border border-[#5C4977]">
            <Menu className="w-5 h-5" />
            <span>All Categories</span>
          </button>

          
          
          <nav className="flex gap-6 text-gray-700 font-medium">
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-lg hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/30"
            >
              Promotions
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-lg hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/30"
            >
              Stores
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-lg hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/30"
            >
              Our Contacts
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-lg hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/30"
            >
              Delivery & Return
            </a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 hover:shadow-lg hover:shadow-[#5C4977]/20 border border-transparent hover:border-[#5C4977]/30"
            >
              Outlet
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile Search Bar - Appears when needed */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 border border-transparent hover:border-[#5C4977]/30 transition-all duration-300">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 ml-3 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm"
          />
        </div>
      </div>
      

      {/* Mobile Navigation Menu (Side Panel) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-[#5C4977]">MET</span>
              <span className="text-xl font-bold text-[#5C4977]">SHOP</span>
            </div>

        
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-[#5C4977] text-white px-4 py-3 rounded-lg hover:bg-[#5C4977]/90 transition-all duration-300">
              <Menu className="w-5 h-5" />
              <span>All Categories</span>
            </button>
            
            
            <a 
              href="#" 
              className="block px-4 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 border border-transparent hover:border-[#5C4977]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Promotions
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 border border-transparent hover:border-[#5C4977]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stores
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 border border-transparent hover:border-[#5C4977]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Contacts
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 border border-transparent hover:border-[#5C4977]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Delivery & Return
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 rounded-lg transition-all duration-300 hover:text-[#5C4977] hover:bg-[#5C4977]/10 border border-transparent hover:border-[#5C4977]/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Outlet
            </a>
          </nav>

          {/* Mobile Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>24 Support:</span>
                <span className="text-[#5C4977] font-semibold">+1 212-334-0212</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span>Worldwide Shipping</span>
              </div>
              <div className="text-[#5C4977] font-semibold">
                Free Shipping Available
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5 İkonlu Mobil Aşağı Naviqasiya Paneli (Səhifəyə Bərkidilmiş) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl shadow-gray-400/50">
        <div className="flex justify-around items-center h-16 w-full px-2">
          {/* 1. Axtarış (Search) */}
          <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium mt-1">Axtar</span>
          </button>

          {/* 2. Müqayisə (Repeat2) */}
          <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200 relative">
            <Repeat2 className="w-5 h-5" />
            <span className="text-xs font-medium mt-1">Müqayisə</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-[#5C4977] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
          </button>

          {/* 3. İstək Siyahısı (Heart) */}
          <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200 relative">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium mt-1">Seçilmişlər</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-[#5C4977] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
          </button>

          {/* 4. Səbət (ShoppingCart) - Əsas rəngdə vurğulanmışdır */}
          <button className="flex flex-col items-center text-[#5C4977] transition-colors duration-200 relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Səbət</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-[#5C4977] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
          </button>
          
          {/* 5. Profil (User) */}
          <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
            <User className="w-5 h-5" />
            <span className="text-xs font-medium mt-1">Profil</span>
          </button>
        </div>
      </div>
    </header>
  )
}