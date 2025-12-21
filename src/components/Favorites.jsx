import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { Link } from "react-router-dom";
// Lucide icon
import { Heart, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumb from "./ui/Breadcrumb";
import Product from "./Product";
import { getFavorites } from "../utils/favorites";

const FavoriteButton = () => {
  // Tüm ürünleri getir
  const { data: productsData, isLoading } = useGetProductsQuery();
  const allProducts = productsData?.products || [];
  
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [localFavorites, setLocalFavorites] = useState([]);

  // localStorage'dan favori ID'lerini al
  useEffect(() => {
    const ids = getFavorites();
    setFavoriteIds(ids);
    
    // Favori ID'lere göre ürünleri filtrele
    const favoriteProducts = allProducts.filter(product => 
      ids.includes(product._id)
    );
    setLocalFavorites(favoriteProducts);
  }, [allProducts]);

  // localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const ids = getFavorites();
      setFavoriteIds(ids);
      const favoriteProducts = allProducts.filter(product => 
        ids.includes(product._id)
      );
      setLocalFavorites(favoriteProducts);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, [allProducts]);

  // 1) Yüklənmə vəziyyəti
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // 2) Boş siyahı
  if (!localFavorites.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Seçilmişlər" }
              ]}
            />
            <div className="text-center space-y-6 max-w-md mx-auto">
              {/* Böyük Heart ikonu - light grey outline */}
              <Heart className="mx-auto w-32 h-32 text-gray-300 stroke-2 fill-none mb-4" />

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Seçilmişlər siyahısı boşdur.
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Hələ seçilmişlər siyahınızda məhsul yoxdur. "Mağaza" səhifəsində çoxlu maraqlı məhsul tapacaqsınız.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#5C4977] text-white text-base font-semibold rounded-lg hover:bg-[#4a3d62] transition-all duration-300 cursor-pointer"
              >
                Mağazaya Qayıt
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 3) Favoritlər siyahısı dolu olduqda
  // Product component'inin beklediği formata dönüştür
  const formattedProducts = localFavorites.map((product) => ({
    _id: product._id,
    name: product.name,
    brand: product.brand || "",
    model: product.model || "",
    price: `${product.price?.toFixed(2) || '0.00'} ₼`,
    inStock: product.stock > 0,
    imageUrl: product.images?.[0]?.url || product.image || "",
    imageAlt: product.name || "Məhsul Şəkli",
    isHot: product.isHot || false,
    rating: product.ratings || 5,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Seçilmişlər" }
              ]}
            />
          </div>
          
          {/* Başlıq */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-10">
            Seçilmişlər
          </h2>

          {/* Məhsul Kartları - Product component kullan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {formattedProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FavoriteButton;