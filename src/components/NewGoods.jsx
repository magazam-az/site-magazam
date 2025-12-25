import React, { useMemo } from "react";
import Container from "./ui/Container";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { Loader2 } from "lucide-react";
import Products from "./Products";

export default function NewGoods({ newGoodsData }) {
  console.log("NewGoods component rendered with data:", newGoodsData);
  
  if (!newGoodsData) {
    console.warn("NewGoods: newGoodsData is null or undefined");
    return null;
  }

  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useGetProductsQuery();
  
  const title = newGoodsData.title || "New Goods";
  const selectedProductIds = newGoodsData.selectedProducts || [];
  
  console.log("NewGoods - Title:", title, "Selected Product IDs:", selectedProductIds);

  // Filter products based on selected product IDs
  const filteredProducts = useMemo(() => {
    if (!productsData?.products || !Array.isArray(productsData.products)) {
      return [];
    }

    if (selectedProductIds.length === 0) {
      return [];
    }

    // Filter products that match selected IDs
    const products = productsData.products.filter((product) => {
      const productId = product._id || product.id;
      return selectedProductIds.includes(productId);
    });

    // Map to Product component format
    return products.map((product) => ({
      _id: product._id,
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
  }, [productsData, selectedProductIds]);

  if (isProductsLoading) {
    return (
      <Container>
        <div className="w-full py-8 sm:py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </Container>
    );
  }

  if (isProductsError) {
    return null;
  }

  // Show message if no products selected, but still show the section
  if (filteredProducts.length === 0) {
    return (
      <Container>
        <div className="w-full py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 tracking-tight text-center sm:text-left">
            {title}
          </h2>
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#5C4977]/10">
            <div className="text-[#5C4977]/60 text-5xl mb-4">📦</div>
            <div className="text-gray-400 text-lg mb-2">Məhsul seçilməyib</div>
            <div className="text-gray-500 text-sm">
              Admin panelindən məhsullar seçilməlidir.
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Banner məlumatlarını hazırla
  const bannerData = newGoodsData.banner && newGoodsData.banner.image?.url ? {
    imageUrl: newGoodsData.banner.image.url,
    alt: newGoodsData.banner.title || "Banner",
    subtitle: newGoodsData.banner.subtitle || "",
    title: newGoodsData.banner.title || "",
    buttonText: newGoodsData.banner.buttonText || "",
    buttonLink: newGoodsData.banner.buttonLink || "#",
  } : null;

  const showBanner = !!bannerData;

  return <Products title={title} products={filteredProducts} showBanner={showBanner} bannerData={bannerData} />;
}

