"use client"

import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import About from "./About"
import { useGetPromotionsQuery } from "../redux/api/promotionApi"
import { Loader2 } from "lucide-react"

// Breadcrumb komponenti
const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.path ? (
            <Link to={item.path} className="hover:text-gray-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-bold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}


const MetashopPromotions = () => {
  const { data, error, isLoading } = useGetPromotionsQuery();
  const promotions = data?.promotions || [];

  // Tarix formatla
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const PromotionCard = ({ promotion }) => {
    const dateRange = formatDateRange(promotion.startDate, promotion.endDate);
    
    return (
      <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full w-full max-w-full">
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden">
          <img
            src={promotion.image?.url || "/placeholder.svg"}
            alt={promotion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Beyaz parıltılı overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          {/* Animasyonlu shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-8 py-4 text-white transform translate-y-4 group-hover:-translate-y-6 transition-transform duration-300">
          <p className="text-sm font-light opacity-90 mb-1">{dateRange}</p>
          <h3 className="text-2xl font-semibold mb-3 line-clamp-2">{promotion.title}</h3>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
            <Link
              to={`/promotions/${promotion.slug || promotion._id}`}
              className="inline-flex items-center bg-[#5C4977] text-white px-3 py-1.5 rounded text-base font-medium hover:bg-[#4a3d62] transition-colors"
            >
              <span>Read More</span>
            </Link>
          </div>
        </div>

        <Link
          to={`/promotions/${promotion.slug || promotion._id}`}
          className="absolute inset-0 z-10"
          aria-label={`${promotion.title} üçün ətraflı məlumat`}
        ></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-14 md:pb-0">
      {/* Navbar komponenti */}
      <Navbar />

      {/* Əsas məzmun */}
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Promosiyalar" }
              ]}
            />
          </div>

          {/* Başlıq */}
          <div className="py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Promosiyalar
            </h1>
          </div>

          {/* Promosiyalar grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Xəta baş verdi: {error?.data?.error || "Promotion-lar yüklənərkən xəta baş verdi"}</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Hələ promotion yoxdur.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-10 md:mb-12">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion._id} promotion={promotion} />
              ))}
            </div>
          )}
        </div>

        {/* About komponenti */}
        <About />
      </section>

      {/* Footer komponenti */}
      <Footer />
    </div>
  )
}

export default MetashopPromotions