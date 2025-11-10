import { Search, Phone, Globe, User, RotateCw, Heart, ShoppingCart } from "lucide-react"

export default function MetaShopHeader() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Top Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-sm">
          <div></div>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-gray-700 font-medium">24 Support</div>
                <div className="text-blue-600">+1 212-334-0212</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-gray-700 font-medium">Worldwide</div>
                <div className="text-blue-600">Free Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold">
              <span className="text-purple-900">META</span>
              <span className="text-red-600">SHOP</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section - Account & Cart */}
          <div className="flex items-center gap-6">
            <User className="w-6 h-6 text-gray-700 cursor-pointer" />
            <div className="relative">
              <RotateCw className="w-6 h-6 text-gray-700 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-700 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="relative">
              <Heart className="w-6 h-6 text-gray-700 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-700 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </span>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="text-sm text-gray-700 font-semibold">0,00 ₽</span>
              </div>
              <span className="absolute -top-2 -right-2 bg-purple-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 py-4 px-4 bg-purple-900 text-white rounded-l-lg hover:bg-purple-800 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5a1 1 0 011-1h12a1 1 0 011 1v2H3V5zm0 5h14v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
              </svg>
              All Categories
            </button>
            <a href="#" className="py-4 text-gray-700 hover:text-purple-900 font-medium">
              Promotions
            </a>
            <a href="#" className="py-4 text-gray-700 hover:text-purple-900 font-medium">
              Stores
            </a>
            <a href="#" className="py-4 text-gray-700 hover:text-purple-900 font-medium">
              Our Contacts
            </a>
            <a href="#" className="py-4 text-gray-700 hover:text-purple-900 font-medium">
              Delivery & Return
            </a>
            <a href="#" className="py-4 text-gray-700 hover:text-purple-900 font-medium">
              Outlet
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
