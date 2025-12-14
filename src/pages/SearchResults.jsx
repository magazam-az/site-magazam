import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useSearchProductsQuery } from "../redux/api/productsApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Product from "../components/Product";
import Breadcrumb from "../components/ui/Breadcrumb";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: searchData,
    isLoading,
    isError,
    error,
  } = useSearchProductsQuery(
    { query, page, limit },
    { skip: !query || query.trim() === "" }
  );

  const products = searchData?.products || [];
  const totalProducts = searchData?.totalProducts || 0;
  const totalPages = searchData?.totalPages || 0;

  useEffect(() => {
    setPage(1);
  }, [query]);

  if (!query || query.trim() === "") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <section className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
            {/* Breadcrumb */}
            <div className="py-6 pb-0">
              <Breadcrumb 
                items={[
                  { label: "Ana səhifə", path: "/" },
                  { label: "Axtarış Nəticələri" }
                ]}
              />
            </div>
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#5C4977] mb-2">
                Axtarış sorğusu daxil edin
              </h2>
              <p className="text-gray-600">
                Navbar-dakı axtarış sahəsindən məhsul axtarın
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Axtarış Nəticələri" }
              ]}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-4">
              Axtarış Nəticələri
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Search className="w-5 h-5" />
              <span>
                "{query}" üçün <strong>{totalProducts}</strong> nəticə tapıldı
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
              <p className="mt-4 text-gray-600">Axtarış nəticələri yüklənir...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16">
              <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Xəta baş verdi
              </h3>
              <p className="text-gray-600">
                {error?.data?.message || "Axtarış zamanı xəta baş verdi"}
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && !isError && (
            <>
              {products.length > 0 ? (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {products.map((product) => (
                      <Product key={product._id} mehsul={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-[#5C4977]/20 rounded-lg text-[#5C4977] hover:bg-[#5C4977]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Əvvəlki
                      </button>
                      <span className="px-4 py-2 text-gray-600">
                        Səhifə {page} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-[#5C4977]/20 rounded-lg text-[#5C4977] hover:bg-[#5C4977]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Növbəti
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#5C4977] mb-2">
                    Nəticə tapılmadı
                  </h3>
                  <p className="text-gray-600 mb-4">
                    "{query}" üçün heç bir məhsul tapılmadı
                  </p>
                  <Link
                    to="/catalog"
                    className="inline-block px-6 py-3 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors"
                  >
                    Bütün Məhsullara Bax
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SearchResults;

