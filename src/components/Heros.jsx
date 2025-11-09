import React from 'react';

// A small component for the countdown timer boxes
// You can make this a separate file or keep it here
const CountdownBox = ({ value, label }) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-md p-2 w-14 text-center shadow-sm">
    <span className="text-2xl font-bold text-gray-900 block">{value}</span>
    <span className="text-xs uppercase text-gray-600">{label}</span>
  </div>
);

export default function ProductBanners() {
  return (
    <div className="p-4 sm:p-6 bg-gray-100">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- 1. Left Column (Smart Appliances) --- */}
        <div className="lg:w-2/3">
          <div className="relative bg-gray-900 text-white p-8 md:p-12 rounded-lg overflow-hidden h-full flex flex-col justify-between min-h-[500px]">
            {/* These are placeholders for the images. 
              In a real app, you'd use <img /> tags with absolute positioning.
                                        */}
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-2">
                Discount on all Smart appliances up to 25%
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-md">
                Shop great deals on MacBook, iPad, iPhone and more.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition-colors">
                Shop Now
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="relative z-10 flex gap-2 mt-8">
              <span className="w-3 h-3 bg-gray-500 rounded-full cursor-pointer"></span>
              <span className="w-3 h-3 bg-white rounded-full cursor-pointer"></span>
              <span className="w-3 h-3 bg-gray-500 rounded-full cursor-pointer"></span>
            </div>
          </div>
        </div>
        
        {/* --- 2. Right Column (contains 3 cards) --- */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          
          {/* Card 2.1: Aurora Headset */}
          <div className="relative bg-pink-100 p-6 rounded-lg overflow-hidden">
            {/*  - Placeholder for the headset image */}
            <div className="absolute top-0 right-0 w-2/3 -mt-8 -mr-8 opacity-80">
              {/* You would place your <img /> tag here */}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Aurora Headset</h3>
              <div className="flex gap-2 mb-4">
                <CountdownBox value="52" label="Days" />
                <CountdownBox value="06" label="Hr" />
                <CountdownBox value="33" label="Min" />
                <CountdownBox value="08" label="Sc" />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                Buy Now
              </button>
            </div>
          </div>
          
          {/* Row for the two bottom cards */}
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Card 2.2: New Dual Sense */}
            <div className="bg-blue-500 text-white p-6 rounded-lg flex-1">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <h3 className="text-xl font-bold">New Dual Sense</h3>
                  <p className="text-sm text-blue-100 mb-4">For PlayStation 5</p>
                  <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
                {/*  - Placeholder */}
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
                </div>
              </div>
            </div>
            
            {/* Card 2.3: Instant Cameras */}
            <div className="bg-yellow-400 text-gray-900 p-6 rounded-lg flex-1">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <h3 className="text-xl font-bold">Instant Cameras</h3>
                  <p className="text-sm text-gray-700 mb-4">Get photo paper as a gift</p>
                  <button className="bg-white text-yellow-800 font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
                {/*  - Placeholder */}
                <div className="flex-shrink-0">
                  {/* You would place your <img /> tag here */}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}