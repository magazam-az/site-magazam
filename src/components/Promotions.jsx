"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

const MetashopPromotions = () => {
  // Promosiyaların məlumatları
  const promotions = [
    {
      id: 1,
      title: "Apple Shopping Event",
      subtitle: "24 Nov - 2 Dec",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/11/apple-shopping-event-banner.jpeg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 2,
      title: "Pre-Order Google Pixel 7",
      subtitle: "10 Nov - 28 Nov",
      imageUrl: "https://metashop.az/wp-content/uploads/2022/12/pre-order-g-pixel-7.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 3,
      title: "Discount on all Smart appliances up to 25%",
      subtitle: "10 Nov - 28 Nov",
      imageUrl: "https://metashop.az/wp-content/uploads/2022/12/discount-on-all-smart-appliances.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 4,
      title: "New Aurora Headset",
      subtitle: "20 Oct - 05 Nov",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/logitech-aurora-headset-opt.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 5,
      title: "DualSense Discount",
      subtitle: "15 Oct - 25 Oct",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/new-dualsense.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 6,
      title: "Gift Photo paper for instant cameras",
      subtitle: "12 Oct - 20 Oct",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/instant-cameras.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 7,
      title: "Discount Nothing phone 1",
      subtitle: "10 Oct - 18 Oct",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/nothing-phone-1.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 8,
      title: "Discount Xiaomi mi 11",
      subtitle: "27 Sep - 15 Oct",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/xiaomi-mi-11.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
    {
      id: 9,
      title: "Discount for new 7000 processors",
      subtitle: "25 Sep - 10 Oct",
      imageUrl: "https://metashop.az/wp-content/uploads/2023/01/available-new-7000-series.jpg",
      readMoreLink: "https://metashop.az/apple-shopping-event/",
    },
  ]

  // "Read More" bölməsi üçün durum
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const PromotionCard = ({ promotion }) => {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <img
            src={promotion.imageUrl || "/placeholder.svg"}
            alt={promotion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-xs font-light opacity-90 mb-1">{promotion.subtitle}</p>
          <h3 className="text-base font-semibold mb-3 line-clamp-2">{promotion.title}</h3>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={promotion.readMoreLink}
              className="inline-flex items-center bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Read More</span>
              <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>

        <a
          href={promotion.readMoreLink}
          className="absolute inset-0 z-10"
          aria-label={`${promotion.title} üçün ətraflı məlumat`}
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar komponenti */}
      <Navbar />

      {/* Breadcrumb yolu */}
   

      {/* Əsas məzmun */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Başlıq bölməsi */}
        <div className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-light">CLOTHES THAT YOU LIKE</p>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Promotions</h1>
          </div>
        </div>

        {/* Promosiyalar grid - RESPONSİV: 1 sütun mobil, 2 sütun tablet, 3 sütun desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
          {promotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>

        {/* Alt məlumat bölməsi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Online store of household appliances and electronics
          </h2>

          <div className="text-gray-700 text-sm md:text-base space-y-4">
            <p>
              Then the question arises: where's the content? Not there yet? That's not so bad, there's dummy copy to the
              rescue. But worse, what if the fish doesn't fit in the can, the foot's to big for the boot? Or to small?
              To short sentences, to many headings, images too large for the proposed design, or too small, or they fit
              in but it looks iffy for reasons.
            </p>

            <p>
              A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite
              put a finger on it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there
              wasn't a process agreed upon or specified with the granularity required. It's content strategy gone awry
              right from the start. If that's what you think how bout the other way around? How can you evaluate content
              without design? No typography, no colors, no layout, no styles, all those things that convey the important
              signals that go beyond the mere textual, hierarchies of information, weight, emphasis, oblique stresses,
              priorities, all those subtle cues that also have visual and emotional appeal to the reader.
            </p>
          </div>

          {/* "Read More" düyməsi */}
          <div className=" mt-6">
            <button
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm"
            >
              <span className="font-medium">Read More</span>
              <svg
                className={`w-4 h-4 ml-2 transform transition-transform ${showMoreInfo ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>

          {/* Əlavə məlumat (açılan bölmə) */}
          {showMoreInfo && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">
                This is additional information that appears when you click the "Read More" button. You can add more
                details about your store, promotions, or any other relevant information here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer komponenti */}
      <Footer />
    </div>
  )
}

export default MetashopPromotions