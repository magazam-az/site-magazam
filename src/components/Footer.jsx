import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTelegramPlane, FaTiktok, FaMapMarkerAlt } from 'react-icons/fa';
import Container from '../ui/Container';

const Footer = () => {
  return (
    // <Container>
    <footer className="bg-gray-50 py-10 mx-auto text-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-wrap justify-between gap-y-10">

          {/* 1. Kontakt */}
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Şirkət haqqında</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Karyera</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Magazam Studio</a></li>
            </ul>
          </div>

          {/* 2. Müştəriyə dəstək */}
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Müştəriyə dəstək</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Çatdırılma və ödəmə</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Geri qaytarma</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Hissə-hissə ödəniş</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Saytdan istifadə şərtləri</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Konfidensiallıq siyasəti</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Zəmanətlər</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Tez-tez verilən suallar</a></li>
            </ul>
          </div>

          {/* 3. Xidmət və servislər */}
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Xidmət və servislər</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Online Trade-in</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">2 saata qapıda</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Ən yaxşı qiymətə zəmanət!</a></li>
              <li><a href="#" className="hover:text-[#5C4977] transition duration-150">Korporativ satışlar</a></li>
            </ul>
          </div>

          {/* 4. Əlaqə və Sosial Şəbəkələr */}
          <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Əlaqə</h3>
            <div className="flex items-center mb-6 space-x-4">
              <span className="text-3xl font-extrabold text-[#5C4977]">*9999</span>
              <a href="#" className="flex items-center border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition duration-150">
                <FaMapMarkerAlt className="mr-2 text-[#5C4977]" /> Xəritə
              </a>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-800">Biz sosial şəbəkələrdə</h3>
            <div className="flex space-x-3 mb-8">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaYoutube className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaWhatsapp className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaTelegramPlane className="text-sm" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-[#5C4977] transition duration-150">
                <FaTiktok className="text-sm" />
              </a>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-800">Təhlükəsiz alış-veriş</h3>
            <div className="flex space-x-3">
              <div className="bg-white border border-gray-300 p-2 rounded-md text-xs font-semibold text-[#5C4977]">VISA</div>
              <div className="bg-white border border-gray-300 p-2 rounded-md text-xs font-semibold text-[#5C4977]">💳</div> 
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © Magazam 2025 
            <span className="inline-block align-middle ml-2 text-xs font-medium text-[#5C4977]">| EURONICS GROUP</span> 
          </p>
        </div>
      </div>
    </footer>
    // </Container>
  );
};

export default Footer;