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

  // Eğer məhsul yoxdursa, heç nə göstərmə
  if (filteredProducts.length === 0) {
    return null;
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
  const moreProductsLink = newGoodsData.moreProductsLink || null;
  const moreProductsButtonText = newGoodsData.moreProductsButtonText || (moreProductsLink ? "More Products" : null);

  console.log("NewGoods - Banner data:", bannerData);
  console.log("NewGoods - Show banner:", showBanner);
  console.log("NewGoods - Filtered products count:", filteredProducts.length);
  console.log("NewGoods - More products link:", moreProductsLink);

  return <Products title={title} products={filteredProducts} showBanner={showBanner} bannerData={bannerData} moreProductsLink={moreProductsLink} moreProductsButtonText={moreProductsButtonText} />;
}

