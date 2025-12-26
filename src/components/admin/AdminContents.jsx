import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetOrCreateHomePageContentQuery,
} from "../../redux/api/pageContentApi";
import { useGetAllHeroesQuery } from "../../redux/api/heroApi";
import { FaEdit } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AdminContents = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetOrCreateHomePageContentQuery();
  const { data: heroesData, isLoading: isLoadingHeroes } = useGetAllHeroesQuery();

  const pageContent = data?.pageContent;
  const blocks = pageContent?.blocks || [];
  const heroes = heroesData?.heroes || [];

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Kontentlər">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const getBlockTypeLabel = (type) => {
    switch (type) {
      case "DefaultSlider":
        return "Hero";
      case "Categories":
        return "Kateqoriyalar";
      case "BestOffers":
        return "BestOffers";
      case "NewGoods":
        return "NewGoods";
      case "ShoppingEvent":
        return "ShoppingEvent";
      case "HomeAppliances":
        return "HomeAppliances";
      case "Accessories":
        return "Accessories";
      case "Blogs":
        return "Blogs";
      case "About":
        return "About";
      default:
        return type;
    }
  };

  return (
    <AdminLayout pageTitle="Kontentlər">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">
                  Kontentlər İdarəetməsi
                </h1>
                <p className="text-gray-600">
                  Səhifə kontentlərini və bloklarını idarə edin
                </p>
              </div>
            </div>
          </div>

          {/* Page Content List */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">
                Ana Səhifə
              </h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {(heroes.length + blocks.length) || 0} blok
              </span>
            </div>

            <div className="space-y-4">
              {heroes.length === 0 && blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">Hələ heç bir blok əlavə edilməyib</p>
                  <button
                    onClick={() =>
                      navigate(`/admin/contents/home/edit`)
                    }
                    className="bg-[#5C4977] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-all duration-200 cursor-pointer"
                  >
                    Blok Əlavə Et
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Hero-ları göstər - əvvəlcə */}
                  {!isLoadingHeroes && heroes.map((hero, heroIndex) => (
                    <div
                      key={hero._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#5C4977]/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#5C4977]/10 text-[#5C4977] font-bold w-10 h-10 rounded-full flex items-center justify-center">
                          {heroIndex + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Hero
                          </h3>
                          <p className="text-sm text-gray-500">
                            {hero.isActive ? "Aktiv" : "Deaktiv"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/admin/contents/home/edit`)
                        }
                        className="bg-[#5C4977] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <FaEdit className="h-4 w-4" />
                        Redaktə Et
                      </button>
                    </div>
                  ))}

                  {/* Digər bloklar */}
                  {[...blocks]
                    .sort((a, b) => a.order - b.order)
                    .map((block, index) => (
                      <div
                        key={block._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#5C4977]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-[#5C4977]/10 text-[#5C4977] font-bold w-10 h-10 rounded-full flex items-center justify-center">
                            {heroes.length + index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {getBlockTypeLabel(block.type)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Sıra: {block.order} |{" "}
                              {block.isActive ? "Aktiv" : "Deaktiv"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/admin/contents/home/edit`)
                          }
                          className="bg-[#5C4977] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                        >
                          <FaEdit className="h-4 w-4" />
                          Redaktə Et
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContents;

