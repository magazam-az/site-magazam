import React from 'react';
import Products from './Products';
import { useGetHomeAppliancesQuery } from '../redux/api/homeAppliancesApi';
import { Loader2 } from 'lucide-react';

const HomeAppliances = () => {
  const { data: homeAppliancesData, isLoading } = useGetHomeAppliancesQuery();
  const homeAppliances = homeAppliancesData?.homeAppliances;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
      </div>
    );
  }

  if (!homeAppliances || !homeAppliances.isActive) {
    return null;
  }

  // Backend-dən gələn məhsulları Products komponentinə uyğun formata çevir
  const hotLabel = homeAppliances.hotLabel || "Hot";
  const formattedProducts = homeAppliances.selectedProductIds?.map((product) => ({
    _id: product._id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    model: product.model,
    price: typeof product.price === 'number' 
      ? `${product.price.toFixed(2)} ₼` 
      : product.price || "0.00 ₼",
    inStock: product.stock > 0,
    imageUrl: product.images?.[0]?.url || product.image || "",
    imageAlt: product.name || "Product Image",
    isHot: true, // HomeAppliances-də bütün məhsullar "Hot" olaraq göstərilir
    hotLabel: hotLabel, // Hot label-i məhsula əlavə et
    rating: product.ratings || product.rating || 5,
  })) || [];

  return (
    <Products 
      title={homeAppliances.title || "Home Appliance"}
      products={formattedProducts}
    />
  );
};

export default HomeAppliances;