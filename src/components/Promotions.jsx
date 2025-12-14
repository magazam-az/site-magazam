"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import Breadcrumb from "./ui/Breadcrumb"
import About from "./About"

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


  const PromotionCard = ({ promotion }) => {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden">
          <img
            src={promotion.imageUrl || "/placeholder.svg"}
            alt={promotion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-10 py-4 text-white transform translate-y-8 group-hover:-translate-y-6 transition-transform duration-300">
          <p className="text-sm font-light opacity-90 mb-1">{promotion.subtitle}</p>
          <h3 className="text-2xl font-semibold mb-3 line-clamp-2">{promotion.title}</h3>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={promotion.readMoreLink}
              className="inline-flex items-center bg-[#5C4977] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-[#5C4977]/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Read More</span>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-10">
            Promosiyalar
          </h2>

          {/* Promosiyalar grid - RESPONSİV: 1 sütun mobil, 2 sütun tablet, 3 sütun desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-6">
            {promotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </div>

        {/* About komponenti - container dışında, kendi Container'ını kullanacak */}
        <About />
      </section>

      {/* Footer komponenti */}
      <Footer />
    </div>
  )
}

export default MetashopPromotions