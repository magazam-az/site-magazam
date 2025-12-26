import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-8 md:p-12">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-[#5C4977] mb-4">404</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#5C4977] to-[#8B699B] mx-auto rounded-full"></div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Səhifə tapılmadı
          </h2>
          <p className="text-gray-600 mb-8">
            Axtardığınız səhifə mövcud deyil və ya silinib. Zəhmət olmasa başqa bir səhifəyə keçin.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#5C4977] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#5C4977]/90 transition-all duration-200 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
            >
              <Home className="h-5 w-5" />
              Ana Səhifə
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white text-[#5C4977] border-2 border-[#5C4977] px-6 py-3 rounded-xl font-medium hover:bg-[#5C4977]/5 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              Geri Qayıt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

