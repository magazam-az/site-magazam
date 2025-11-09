"use client";

import {
  Home,
  Heart,
  LayoutGrid,
  ShoppingCart,
  User,
  Search,
  Menu,
  ShieldCheck,
  Clock,
  Truck,
  CreditCard,
} from "lucide-react";

// Tünd fonda olan 4 kiçik kart (Mobil üçün)
const MobileFeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#242424] p-4 rounded-xl shadow-lg flex flex-col h-full cursor-pointer hover:bg-gray-800 transition">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#5C4977] shrink-0" />
      <h3 className="text-white font-semibold text-base">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm mt-2">{description}</p>
  </div>
);

// Reklam Blokları üçün (Responsive)
const AdvertBlock = ({ className, title, subtitle, buttonText, isLarge = false, children }) => (
  <div className={`rounded-xl p-6 shadow-xl relative overflow-hidden ${className} ${
    isLarge ? 'lg:col-span-2 h-64 md:h-80 lg:h-96' : 'h-64'
  }`}>
    <div className="relative z-10 h-full flex flex-col justify-end">
      <h2 className={`${
        isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
      } font-bold ${isLarge ? 'text-white' : 'text-black'}`}>
        {title}
      </h2>
      <p className={`${
        isLarge ? 'text-gray-200' : 'text-gray-700'
      } mt-1 mb-4 text-sm md:text-base`}>
        {subtitle}
      </p>
      {buttonText && (
        <button className={`px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold w-fit transition text-sm md:text-base
          ${isLarge ? 'bg-[#5C4977] text-white hover:bg-[#5C4977]/90' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          {buttonText}
        </button>
      )}
      {children}
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ---------------------------------------------------- */}
      {/* MOBİL GÖRÜNÜŞ (lg breakpoint-ə qədər) */}
      {/* ---------------------------------------------------- */}
      <div className="lg:hidden min-h-screen bg-black text-white pb-20">
        {/* Özəlliklər Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MobileFeatureCard
              icon={ShieldCheck}
              title="Zəmanət"
              description="2 il rəsmi zəmanət"
            />
            <MobileFeatureCard
              icon={Clock}
              title="Sürətli Çatdırılma"
              description="2 saat ərzində çatdırılma"
            />
            <MobileFeatureCard
              icon={Truck}
              title="Pulsuz Çatdırılma"
              description="100 AZN-dən yuxarı sifarişlərdə"
            />
            <MobileFeatureCard
              icon={CreditCard}
              title="Taksit İmkanı"
              description="12 aya qədər taksit"
            />
          </div>
        </div>

        {/* Reklam Blokları - Mobil */}
        <div className="p-4 space-y-4">
          {/* Google Pixel 7 */}
          <div className="bg-linear-to-r from-gray-800 to-gray-600 rounded-xl p-6 shadow-lg relative overflow-hidden h-64">
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-white">The new Google Pixel 7</h2>
              <p className="text-gray-200 mt-1 mb-4">Shop great deals on MacBook, iPad, iPhone and more.</p>
              <button className="bg-[#5C4977] text-white px-6 py-2 rounded-lg font-semibold w-fit hover:bg-[#5C4977]/90 transition">
                Pre-Order Now
              </button>
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-full h-full bg-linear-to-r from-gray-800/80 to-gray-600/80"></div>
          </div>

          {/* Aurora Headset */}
          <div className="bg-linear-to-r from-pink-100 to-pink-50 rounded-xl p-6 shadow-lg relative overflow-hidden h-64">
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-black">Aurora Headset</h2>
              <div className="flex justify-start items-center bg-white p-3 rounded-lg text-sm font-semibold shadow-inner mt-4 w-full max-w-64">
                <div className="text-center w-1/4">53 <span className="block font-normal text-xs text-gray-500">Days</span></div>
                <div className="text-center w-1/4">04 <span className="block font-normal text-xs text-gray-500">Hr</span></div>
                <div className="text-center w-1/4">47 <span className="block font-normal text-xs text-gray-500">Min</span></div>
                <div className="text-center w-1/4">48 <span className="block font-normal text-xs text-gray-500">Sc</span></div>
              </div>
              <button className="bg-[#5C4977] text-white px-6 py-2 rounded-lg font-semibold w-fit hover:bg-[#5C4977]/90 transition mt-4">
                Buy Now
              </button>
            </div>
          </div>

          {/* PlayStation Controller */}
          <div className="bg-linear-to-r from-blue-500 to-blue-400 rounded-xl p-6 shadow-lg relative overflow-hidden h-64">
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-white">New Dual Sense</h2>
              <p className="text-gray-200 mt-1 mb-4">For PlayStation 5</p>
              <button className="bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold w-fit hover:bg-gray-100 transition">
                View Details
              </button>
            </div>
          </div>

          {/* Instant Camera */}
          <div className="bg-linear-to-r from-yellow-400 to-yellow-300 rounded-xl p-6 shadow-lg relative overflow-hidden h-64">
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-black">Instant Cameras</h2>
              <p className="text-gray-800 mt-1 mb-4">Get photo paper as a gift</p>
              <button className="bg-white text-yellow-500 px-6 py-2 rounded-lg font-semibold w-fit hover:bg-gray-100 transition">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Aşağı Naviqasiya Paneli */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#242424] border-t border-gray-700 shadow-2xl shadow-black/70">
          <div className="flex justify-around items-center h-16 w-full px-2">
            <button className="flex flex-col items-center text-[#5C4977] transition-colors duration-200">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Ana Səhifə</span>
            </button>
            <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
              <Heart className="w-6 h-6" />
              <span className="text-xs mt-1">Seçilmişlər</span>
            </button>
            <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
              <LayoutGrid className="w-6 h-6" />
              <span className="text-xs mt-1">Kateqoriyalar</span>
            </button>
            <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1">Səbət</span>
            </button>
            <button className="flex flex-col items-center text-gray-500 hover:text-[#5C4977] transition-colors duration-200">
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* DESKTOP/TABLET GÖRÜNÜŞ (lg breakpoint-dən yuxarı) */}
      {/* ---------------------------------------------------- */}
      <div className="hidden lg:block max-w-7xl mx-auto py-8 px-6">
        {/* Reklam Blokları Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Google Pixel 7 */}
          <AdvertBlock 
            className="bg-linear-to-r from-gray-800 to-gray-600 text-white" 
            title="The new Google Pixel 7" 
            subtitle="Shop great deals on MacBook, iPad, iPhone and more." 
            buttonText="Pre-Order Now" 
            isLarge
          />

          {/* Aurora Headset */}
          <AdvertBlock 
            className="bg-linear-to-r from-pink-100 to-pink-50 text-black" 
            title="Aurora Headset" 
            subtitle="Premium sound quality with noise cancellation" 
            buttonText="Buy Now" 
            isLarge
          >
            <div className="flex justify-start items-center bg-white p-3 rounded-lg text-sm font-semibold shadow-inner mt-4 w-64">
              <div className="text-center w-1/4">53 <span className="block font-normal text-xs text-gray-500">Days</span></div>
              <div className="text-center w-1/4">04 <span className="block font-normal text-xs text-gray-500">Hr</span></div>
              <div className="text-center w-1/4">47 <span className="block font-normal text-xs text-gray-500">Min</span></div>
              <div className="text-center w-1/4">48 <span className="block font-normal text-xs text-gray-500">Sc</span></div>
            </div>
          </AdvertBlock>

          {/* PlayStation Controller */}
          <AdvertBlock 
            className="bg-linear-to-r from-blue-500 to-blue-400 text-white" 
            title="New Dual Sense" 
            subtitle="For PlayStation 5" 
            buttonText="View Details"
          />

          {/* Instant Camera */}
          <AdvertBlock 
            className="bg-linear-to-r from-yellow-400 to-yellow-300 text-black" 
            title="Instant Cameras" 
            subtitle="Get photo paper as a gift" 
            buttonText="View Details"
          />
        </div>

        {/* Özəlliklər Grid - Desktop */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <MobileFeatureCard
            icon={ShieldCheck}
            title="Zəmanət"
            description="2 il rəsmi zəmanət"
          />
          <MobileFeatureCard
            icon={Clock}
            title="Sürətli Çatdırılma"
            description="2 saat ərzində çatdırılma"
          />
          <MobileFeatureCard
            icon={Truck}
            title="Pulsuz Çatdırılma"
            description="100 AZN-dən yuxarı sifarişlərdə"
          />
          <MobileFeatureCard
            icon={CreditCard}
            title="Taksit İmkanı"
            description="12 aya qədər taksit"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;