import React, { useMemo } from "react";
import Products from "./Products";
import { useGetProductsQuery } from "../redux/api/productsApi";

const TheBestOffers = () => {
  // API'den ürünleri getir
  const { data: productsData } = useGetProductsQuery();
  
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
    <Products 
      title="The Best Offers"
      products={bestOffersProducts}
    />
  );
};

export default TheBestOffers;

