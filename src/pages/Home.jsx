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
import { useGetHeroesQuery } from "../redux/api/heroApi";
import ProductBanners, { HeroItem } from "../components/Hero";
import { Loader2 } from "lucide-react";

const Home = () => {
  // API'den ürünleri getir
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();
  
  // Ana səhifə kontentini gətir
  const { data: pageContentData, isLoading: pageContentLoading } = useGetPageContentQuery("home");
  const pageContent = pageContentData?.pageContent;
  const blocks = pageContent?.blocks || [];
  
  // Hero'ları gətir
  const { data: heroesData, isLoading: isLoadingHeroes } = useGetHeroesQuery();
  const heroes = (heroesData?.heroes || []).filter(hero => hero.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Hero'ları ve blokları birleştirip order'a göre sırala
  const allItems = [
    ...heroes.map(hero => ({ type: 'hero', id: hero._id, data: hero, order: hero.order || 0 })),
    ...blocks.filter(block => block.isActive && block.type !== "DefaultSlider").map(block => ({ type: 'block', id: block._id, data: block, order: block.order || 0 }))
  ].sort((a, b) => a.order - b.order);
  
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
      
      {/* Hero'ları ve blokları order'a göre birleştirilmiş listede render et */}
      {(pageContentLoading || isLoadingHeroes) ? (
        // Sadece DefaultSlider için skeleton göster
        <div className="w-full my-5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 animate-pulse">
              {/* Left Column Skeleton (Slider) */}
              <div className="lg:w-[680px] w-full">
                <div className="relative rounded-lg overflow-hidden h-full min-h-[420px] bg-gray-200"></div>
              </div>
              
              {/* Right Column Skeleton */}
              <div className="lg:flex-1 flex flex-col gap-6">
                {/* Right Top Skeleton */}
                <div className="relative rounded-xl overflow-hidden h-[250px] bg-gray-200"></div>
                
                {/* Bottom Blocks Skeleton */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 h-[170px] rounded-xl bg-gray-200"></div>
                  <div className="flex-1 h-[170px] rounded-xl bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        allItems.map((item, index) => {
          if (item.type === 'hero') {
            const hero = item.data;
            return (
              <Container key={`hero-${hero._id}`}>
                <HeroItem hero={hero} />
              </Container>
            );
          } else {
            const block = item.data;
            
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
            
            if (block.type === "Products") {
              // Products bloğu (BestOffers + NewGoods birleşimi)
              if (block.productsData) {
                const selectedProductIds = block.productsData.selectedProducts || [];
                
                // useMemo kullanmadan normal JavaScript filtering (hook kurallarına uygun)
                let filteredProducts = [];
                if (productsData?.products && Array.isArray(productsData.products) && selectedProductIds.length > 0) {
                  const products = productsData.products.filter((product) => {
                    const productId = product._id || product.id;
                    return selectedProductIds.includes(productId);
                  });
                  filteredProducts = products.map((product) => ({
                    _id: product._id,
                    slug: product.slug,
                    name: product.name,
                    brand: product.brand,
                    model: product.model,
                    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                    inStock: (product.stock !== undefined && product.stock > 0) || product.inStock !== false,
                    stock: product.stock,
                    imageUrl: product.images?.[0]?.url || product.image || "",
                    imageAlt: product.name || "Product Image",
                    isHot: product.isHot || false,
                    rating: product.ratings || product.rating || 5,
                    sku: product.sku || product._id?.substring(0, 7),
                  }));
                }
                
                const bannerData = block.productsData.banner && block.productsData.banner.image?.url ? {
                  imageUrl: block.productsData.banner.image.url,
                  alt: block.productsData.banner.title || "Banner",
                  subtitle: block.productsData.banner.subtitle || "",
                  title: block.productsData.banner.title || "",
                  buttonText: block.productsData.banner.buttonText || "",
                  buttonLink: block.productsData.banner.buttonLink || "#",
                } : null;
                
                if (productsLoading) {
                  return (
                    <Container key={block._id || index}>
                      <div className="w-full py-8 sm:py-12 flex justify-center items-center">
                        <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
                      </div>
                    </Container>
                  );
                }
                
                if (filteredProducts.length === 0) {
                  return null;
                }
                
                return (
                  <Products 
                    key={block._id || index}
                    title={block.productsData.title || "Məhsullar"}
                    products={filteredProducts}
                    showBanner={!!bannerData}
                    bannerData={bannerData}
                    moreProductsLink={block.productsData.moreProductsLink || null}
                    moreProductsButtonText={block.productsData.moreProductsButtonText || null}
                    badgeText={block.productsData.badgeText || ""}
                    badgeColor={block.productsData.badgeColor || "#FF0000"}
                  />
                );
              } else {
                console.warn("Products block found but productsData is missing:", block);
                return <BestOffers key={block._id || index} bestOffersData={{ title: "Məhsullar", selectedProducts: [] }} />;
              }
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

            if (block.type === "Blogs") {
              if (block.blogData) {
                return <Blogs key={block._id || index} blogData={block.blogData} />;
              } else {
                console.warn("Blogs block found but blogData is missing:", block);
                return null;
              }
            }

            if (block.type === "About") {
              if (block.aboutData) {
                return <About key={block._id || index} aboutData={block.aboutData} />;
              } else {
                console.warn("About block found but aboutData is missing:", block);
                return null;
              }
            }
            
            return null;
          }
        })
      )}
      {/* <FAQPage /> */}
    
     
      <Footer />

      {/* </Container> */}
    </div>
  );
};

export default Home;