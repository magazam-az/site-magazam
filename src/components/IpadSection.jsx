import React from 'react';

const IpadSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      {/* Main Apple Shopping Event Section */}
      <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-lg p-8 shadow-lg mb-12"
           style={{ background: 'linear-gradient(90deg, #FDF7FE 0%, #F5F7FF 100%)' }}>
        
        {/* Image on the left */}
        <div className="mb-8 md:mb-0 md:mr-12">
          {/* Placeholder for the image of Apple devices */}
          {/* In a real scenario, you'd use an <img> tag here */}
          <div className="w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/assets/images/ipad-section/iosmodels.webp" alt="Apple Devices" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* Content on the right */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Apple Shopping Event</h1>
          <p className="text-lg text-gray-600 mb-6">
            Hurry and get discounts on all Apple devices up to 20%
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center md:justify-start space-x-4 mb-8">
            <div className="bg-white p-3 rounded-lg text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-800">52</div>
              <div className="text-sm text-gray-500">Days</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-800">06</div>
              <div className="text-sm text-gray-500">Hr</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-800">52</div>
              <div className="text-sm text-gray-500">Min</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-800">34</div>
              <div className="text-sm text-gray-500">Sc</div>
            </div>
          </div>

          {/* Go Shopping Button */}
          <button className="flex items-center justify-center md:justify-start px-8 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 transition duration-300">
            Go Shopping
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Showcase Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Product Card 1 */}
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img src="https://i.imgur.com/uR1Qz2g.png" alt="Acer ProDesigner" className="object-contain max-h-full max-w-full" />
          </div>
          <p className="font-semibold text-gray-800">Acer ProDesigner</p>
          <p className="text-sm text-gray-600">750,00 лв</p>
        </div>

        {/* Product Card 2 */}
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img src="https://i.imgur.com/05N1GgZ.png" alt="Acer SA100" className="object-contain max-h-full max-w-full" />
          </div>
          <p className="font-semibold text-gray-800">Acer SA100</p>
          <div className="flex justify-center text-yellow-500 my-1">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i}>{star}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600">30,00 лв</p>
        </div>

        {/* Product Card 3 */}
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img src="https://i.imgur.com/0v6z2h7.png" alt="Ailink Aluminium" className="object-contain max-h-full max-w-full" />
          </div>
          <p className="font-semibold text-gray-800">Ailink Aluminium</p>
          <p className="text-sm text-gray-600">40,00 лв</p>
        </div>

        {/* Product Card 4 */}
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img src="https://i.imgur.com/5VlB1wH.png" alt="Alogic Ultra Mini" className="object-contain max-h-full max-w-full" />
          </div>
          <p className="font-semibold text-gray-800">Alogic Ultra Mini</p>
          <div className="flex justify-center text-yellow-500 my-1">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i}>{star}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600">50,00 лв</p>
        </div>

        {/* Product Card 5 */}
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img src="https://i.imgur.com/L79C7eH.png" alt="AMD Radeon Pro" className="object-contain max-h-full max-w-full" />
          </div>
          <p className="font-semibold text-gray-800">AMD Radeon Pro</p>
          <div className="flex justify-center text-yellow-500 my-1">
            {'★★★★★'.split('').map((star, i) => (
              <span key={i}>{star}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600">480,00 лв</p>
        </div>
      </div>
    </div>
  );
};

export default IpadSection;