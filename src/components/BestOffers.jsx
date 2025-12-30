import React, { useMemo } from "react";
import Container from "./ui/Container";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { Loader2 } from "lucide-react";
import Products from "./Products";

export default function BestOffers({ bestOffersData }) {
  console.log("BestOffers component rendered with data:", bestOffersData);
  
  if (!bestOffersData) {
    console.warn("BestOffers: bestOffersData is null or undefined");
    return null;
  }

  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useGetProductsQuery();
  
  const title = bestOffersData.title || "The Best Offers";
  const selectedProductIds = bestOffersData.selectedProducts || [];
  
  console.log("BestOffers - Title:", title, "Selected Product IDs:", selectedProductIds);

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

  const moreProductsLink = bestOffersData.moreProductsLink || null;
  const moreProductsButtonText = bestOffersData.moreProductsButtonText || (moreProductsLink ? "More Products" : null);

  console.log("BestOffers - More Products Link:", moreProductsLink);
  console.log("BestOffers - More Products Button Text:", moreProductsButtonText);

  return <Products title={title} products={filteredProducts} moreProductsLink={moreProductsLink} moreProductsButtonText={moreProductsButtonText} />;
}

