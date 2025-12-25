import React, { useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DefaultSlider from "../components/DefaultSlider";
import DynamicCategories from "../components/DynamicCategories";
import BestOffers from "../components/BestOffers";
import NewGoods from "../components/NewGoods";
import FAQPage from "../components/FAQ";
import ShoppingEvent from "../components/ShoppingEvent";
import Products from "../components/Products";
import HomeAppliances from "../components/HomeAppliances";
import Container from "../components/ui/Container";
import Accessory from "../components/Accessory";
import Blogs from "../components/Blogs";
import About from "../components/About";
import RegisterForm from "../components/Register";
import LoginForm from "../components/Login";
import Products2 from "../components/Products2";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { useGetPageContentQuery } from "../redux/api/pageContentApi";
import ProductBanners from "../components/Hero";

const Home = () => {
  // API'den ürünleri getir
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();
  
  // Ana səhifə kontentini gətir
  const { data: pageContentData, isLoading: pageContentLoading } = useGetPageContentQuery("home");
  const pageContent = pageContentData?.pageContent;
  const blocks = pageContent?.blocks || [];
  
  // Ürünleri Product component'in beklediği formata dönüştür
  const bestOffersProducts = useMemo(() => {
    if (!productsData?.products || !Array.isArray(productsData.products)) {
      return [];
    }
    
    return productsData.products.map((product) => ({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: `${product.price?.toFixed(2) || '0.00'} ₼`,
      inStock: product.stock > 0,
      imageUrl: product.images?.[0]?.url || product.image || "",
      imageAlt: product.name || "Product Image",
      isHot: false, // İsteğe bağlı: backend'de isHot field'ı varsa product.isHot kullanılabilir
      rating: product.ratings || 5,
    }));
  }, [productsData]);

  return (
    <div className="pb-14 md:pb-0 bg-[#F3F4F6]">
      {/* <Container> */}
            {/* <Products2/> */}

      <Navbar />
      <ProductBanners/>
      
      {/* Dinamik blokları render et */}
      {!pageContentLoading && blocks.map((block, index) => {
        if (!block.isActive) return null;
        
        // Debug logging
        if (block.type === "BestOffers") {
          console.log("BestOffers block found:", {
            blockId: block._id,
            type: block.type,
            hasBestOffersData: !!block.bestOffersData,
            bestOffersData: block.bestOffersData,
            isActive: block.isActive
          });
        }
        
        if (block.type === "NewGoods") {
          console.log("NewGoods block found:", {
            blockId: block._id,
            type: block.type,
            hasNewGoodsData: !!block.newGoodsData,
            newGoodsData: block.newGoodsData,
            isActive: block.isActive
          });
        }
        
        if (block.type === "DefaultSlider" && block.sliderData) {
          return <DefaultSlider key={block._id || index} sliderData={block.sliderData} />;
        }
        
        if (block.type === "Categories" && block.categoriesData) {
          return <DynamicCategories key={block._id || index} categoriesData={block.categoriesData} />;
        }
        
        if (block.type === "BestOffers") {
          // Check if bestOffersData exists, even if empty
          if (block.bestOffersData) {
            return <BestOffers key={block._id || index} bestOffersData={block.bestOffersData} />;
          } else {
            console.warn("BestOffers block found but bestOffersData is missing:", block);
            // Still render with default data so admin can see it needs configuration
            return <BestOffers key={block._id || index} bestOffersData={{ title: "The Best Offers", selectedProducts: [] }} />;
          }
        }
        
        if (block.type === "NewGoods") {
          // Check if newGoodsData exists, even if empty
          if (block.newGoodsData) {
            return <NewGoods key={block._id || index} newGoodsData={block.newGoodsData} />;
          } else {
            console.warn("NewGoods block found but newGoodsData is missing:", block);
            // Still render with default data so admin can see it needs configuration
            return <NewGoods key={block._id || index} newGoodsData={{ title: "New Goods", selectedProducts: [] }} />;
          }
        }
        
        if (block.type === "ShoppingEvent") {
          return <ShoppingEvent key={block._id || index} />;
        }

        if (block.type === "HomeAppliances") {
          return <HomeAppliances key={block._id || index} />;
        }

        if (block.type === "Accessories") {
          if (block.accessoryData) {
            return <Accessory key={block._id || index} accessoryData={block.accessoryData} />;
          } else {
            console.warn("Accessories block found but accessoryData is missing:", block);
            return null;
          }
        }
        
        return null;
      })}
      {/* <FAQPage /> */}
      <Blogs />
      <About/>
    
     
      <Footer />

      {/* </Container> */}
    </div>
  );
};

export default Home;