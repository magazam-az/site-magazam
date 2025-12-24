import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DefaultSlider from "../components/DefaultSlider";
import DynamicCategories from "../components/DynamicCategories";
import FAQPage from "../components/FAQ";
import ShoppingEvent from "../components/ShoppingEvent";
import Products from "../components/Products";
import Container from "../components/ui/Container";
import Accessory from "../components/Accessory";
import Blogs from "../components/Blogs";
import About from "../components/About";
import RegisterForm from "../components/Register";
import LoginForm from "../components/Login";
import Products2 from "../components/Products2";
import { useGetPageContentQuery } from "../redux/api/pageContentApi";
import ProductBanners from "../components/Hero";
import NewGoods from "../components/NewGoods";
import TheBestOffers from "../components/TheBestOffers";

const Home = () => {
  // Ana səhifə kontentini gətir
  const { data: pageContentData, isLoading: pageContentLoading } = useGetPageContentQuery("home");
  const pageContent = pageContentData?.pageContent;
  const blocks = pageContent?.blocks || [];

  return (
    <div className="pb-14 md:pb-0 bg-[#F3F4F6]">
      {/* <Container> */}
            {/* <Products2/> */}

      <Navbar />
      <ProductBanners/>
      
      {/* Dinamik blokları render et */}
      {!pageContentLoading && blocks.map((block, index) => {
        if (!block.isActive) return null;
        
        if (block.type === "DefaultSlider" && block.sliderData) {
          return <DefaultSlider key={block._id || index} sliderData={block.sliderData} />;
        }
        
        if (block.type === "Categories" && block.categoriesData) {
          return <DynamicCategories key={block._id || index} categoriesData={block.categoriesData} />;
        }
        
        return null;
      })}
      <TheBestOffers />
      <NewGoods />
      <ShoppingEvent />
      <Products 
        title="Home Appliance"
        products={[
          {
            name: "Acer SA100 SATAIII",
            brand: "SSD Drive",
            model: "Philips",
            type: "SATA 2.5\" Solid State Drive",
            price: "30,00 ₼",
            inStock: true,
            sku: "5334126",
            imageUrl: "/images/thebestoffers/acer-sa100-sataiii-1.jpg",
            imageAlt: "Acer SA100 SATA SSD Drive",
            isHot: true,
            rating: 4.2
          },
          {
            name: "Alogic Ultra Mini USB",
            brand: "Card Readers",
            model: "ASUS",
            type: "SATA 2.5\" Solid State Drive",
            price: "50,00 ₼",
            inStock: true,
            sku: "5334127",
            imageUrl: "/images/thebestoffers/alogic1.jpg",
            imageAlt: "Alogic Ultra Mini USB",
            isHot: true,
            rating: 3.5
          },
          {
            name: "AMD Ryzen 5 7600X",
            brand: "Processors",
            model: "HP",
            type: "SATA 2.5\" Solid State Drive",
            price: "299,00 ₼",
            inStock: true,
            sku: "5334128",
            imageUrl: "/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
            imageAlt: "AMD Ryzen 5 7600X",
            isHot: true,
            rating: 2.7
          },
          {
            name: "Apple iPad Mini 6 Wi-Fi",
            brand: "Apple Ipad",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "500,00 ₼ – 600,00 ₼",
            inStock: true,
            sku: "5334129",
            imageUrl: "/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
            imageAlt: "Apple iPad Mini 6 Wi-Fi",
            isHot: true,
            rating: 4.8
          },
          {
            name: "Apple MacBook Pro 16″ M1",
            brand: "Apple MacBook",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "2.999,00 ₼",
            inStock: true,
            sku: "5334130",
            imageUrl: "/images/thebestoffers/apple-macbook-pro-16.jpg",
            imageAlt: "Apple MacBook Pro 16″ M1",
            isHot: true,
            rating: 5.0
          }
        ]}
      />
      <Accessory />
      {/* <FAQPage /> */}
      <Blogs />
      <About/>
    
     
      <Footer />

      {/* </Container> */}
    </div>
  );
};

export default Home;
