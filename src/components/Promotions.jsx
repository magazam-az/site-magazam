"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useGetPromotionsQuery } from "../redux/api/promotionApi"

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

// About komponenti
const About = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Online store of household appliances and electronics
      </h2>
      
      <div className="text-gray-700 text-sm md:text-base space-y-4">
        <p>
          Then the question arises: where's the content? Not there yet? That's not so bad, there's dummy copy to the rescue. 
          But worse, what if the fish doesn't fit in the can, the foot's to big for the boot? Or to small? To short sentences, 
          to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons.
        </p>
        
        <p>
          A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite put a finger on 
          it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there wasn't a process agreed upon 
          or specified with the granularity required. It's content strategy gone awry right from the start. If that's what you think 
          how bout the other way around? How can you evaluate content without design? No typography, no colors, no layout, no styles, 
          all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight, 
          emphasis, oblique stresses, priorities, all those subtle cues that also have visual and emotional appeal to the reader.
        </p>
      </div>

      {/* "Read More" düyməsi */}
      <div className="text-center mt-6">
        <button 
          onClick={() => setShowMoreInfo(!showMoreInfo)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm"
        >
          <span className="font-medium">{showMoreInfo ? 'Show Less' : 'Read More'}</span>
          <svg 
            className={`w-4 h-4 ml-2 transform transition-transform ${showMoreInfo ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      {/* Əlavə məlumat (açılan bölmə) */}
      {showMoreInfo && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
          <p className="text-gray-700">
            This is additional information that appears when you click the "Read More" button. 
            You can add more details about your store, promotions, or any other relevant information here.
          </p>
        </div>
      )}
    </div>
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
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden">
          <img
            src={promotion.image?.url || "/placeholder.svg"}
            alt={promotion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs font-light opacity-90 mb-1">{dateRange}</p>
          <h3 className="text-base font-semibold mb-3 line-clamp-2">{promotion.title}</h3>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/promotions/${promotion.slug || promotion._id}`}
              className="inline-flex items-center bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <span>Read More</span>
              <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900">
              Promosiyalar
            </h1>
          </div>

          {/* Promosiyalar grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion._id} promotion={promotion} />
              ))}
            </div>
          )}

          {/* About komponenti */}
          <About />
        </div>
      </section>

      {/* Footer komponenti */}
      <Footer />
    </div>
  )
}

export default MetashopPromotions