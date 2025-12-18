import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery, useDeleteCategoryMutation, useDeleteSubcategoryMutation } from "../../redux/api/categoryApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaChevronDown, FaChevronUp, FaImage } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const [expandedCategories, setExpandedCategories] = useState({});

  const categories = data?.categories || [];

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu kateqoriyanı silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Kateqoriya uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Kateqoriya silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu alt kateqoriyanı silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteSubcategory({
          categoryId,
          subcategoryId,
        }).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Alt kateqoriya uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Alt kateqoriya silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Kateqoriyalar">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Kateqoriyalar">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Kateqoriya İdarəetməsi</h1>
                <p className="text-gray-600">Ana kateqoriyalar və alt kateqoriyaları idarə edin</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/admin/categories/create")}
                  className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
                >
                  <FaPlus className="h-5 w-5" />
                  Yeni Kateqoriya
                </button>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#5C4977]">Kateqoriyalar Siyahısı</h2>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {categories.length || 0} kateqoriya
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Slug</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Şəkil</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Alt Kateqoriya</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <React.Fragment key={category._id}>
                      <tr
                        className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors cursor-pointer"
                        onClick={() => toggleCategory(category._id)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {expandedCategories[category._id] ? (
                              <FaChevronUp className="h-4 w-4 text-[#5C4977]" />
                            ) : (
                              <FaChevronDown className="h-4 w-4 text-[#5C4977]" />
                            )}
                            <div className="font-medium text-gray-800">{category.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600 font-mono text-sm">{category.slug || "N/A"}</span>
                        </td>
                        <td className="py-4 px-4">
                          {category.image?.url ? (
                            <img
                              src={category.image.url}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg border border-[#5C4977]/20"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-[#5C4977]/10 rounded-lg flex items-center justify-center">
                              <FaImage className="h-5 w-5 text-[#5C4977]/40" />
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                            {category.subcategories?.length || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                              className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                              title="Redaktə et"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Sil"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedCategories[category._id] && (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#5C4977]">Alt Kateqoriyalar</h3>
                                <button
                                  onClick={() => navigate(`/admin/categories/${category._id}/subcategories/create`)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <FaPlus className="h-4 w-4" />
                                  Alt Kateqoriya Əlavə Et
                                </button>
                              </div>

                              {category.subcategories && category.subcategories.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-[#5C4977]/10">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ad</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Slug</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Şəkil</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {category.subcategories.map((subcategory) => (
                                        <tr
                                          key={subcategory._id}
                                          className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                                        >
                                          <td className="py-4 px-4">
                                            <div className="font-medium text-gray-800">{subcategory.name}</div>
                                          </td>
                                          <td className="py-4 px-4">
                                            <span className="text-gray-600 font-mono text-sm">{subcategory.slug || "N/A"}</span>
                                          </td>
                                          <td className="py-4 px-4">
                                            {subcategory.image?.url ? (
                                              <img
                                                src={subcategory.image.url}
                                                alt={subcategory.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-[#5C4977]/20"
                                              />
                                            ) : (
                                              <div className="w-12 h-12 bg-[#5C4977]/10 rounded-lg flex items-center justify-center">
                                                <FaImage className="h-5 w-5 text-[#5C4977]/40" />
                                              </div>
                                            )}
                                          </td>
                                          <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => navigate(`/admin/categories/${category._id}/subcategories/edit/${subcategory._id}`)}
                                                className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                                                title="Redaktə et"
                                              >
                                                <FaEdit className="h-5 w-5" />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteSubcategory(category._id, subcategory._id)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Sil"
                                              >
                                                <FaTrash className="h-5 w-5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  Alt kateqoriya yoxdur
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Heç bir kateqoriya tapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
