import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPopularCategoriesByIdQuery, useUpdatePopularCategoriesMutation } from "../../redux/api/popularCategoriesApi";
import Swal from "sweetalert2";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditPopularCategories = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetPopularCategoriesByIdQuery(id);
  const [updatePopularCategories, { isLoading: isUpdating }] = useUpdatePopularCategoriesMutation();

  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categoryVisibility, setCategoryVisibility] = useState({});

  useEffect(() => {
    if (data?.popularCategories) {
      const pc = data.popularCategories;
      setTitle(pc.title || "Popular Categories");
      setIsActive(pc.isActive !== undefined ? pc.isActive : true);

      // Category visibility map yarat
      const visibilityMap = {};
      if (pc.categories && Array.isArray(pc.categories)) {
        pc.categories.forEach((cat) => {
          visibilityMap[cat._id] = cat.isVisible !== undefined ? cat.isVisible : true;
        });
      }
      setCategoryVisibility(visibilityMap);
    }
  }, [data]);

  const handleCategoryVisibilityChange = (categoryId, value) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [categoryId]: value === "true" || value === true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const visibleCategories = Object.keys(categoryVisibility).map((categoryId) => ({
        categoryId,
        isVisible: categoryVisibility[categoryId],
      }));

      await updatePopularCategories({
        id,
        popularCategoriesData: {
          title,
          isActive,
          visibleCategories,
        },
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Popular Categories uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/popular-categories");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Popular Categories yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Popular Categories Redaktəsi">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const categories = data?.popularCategories?.categories || [];

  return (
    <AdminLayout pageTitle="Popular Categories Redaktəsi">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/popular-categories")}
            className="mb-6 flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            Geri qayıt
          </button>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <h2 className="text-2xl font-bold text-[#5C4977] mb-6">Popular Categories Redaktəsi</h2>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlıq Mətni *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent outline-none transition-all"
                placeholder="Popular Categories"
              />
            </div>

            {/* IsActive Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  Aktiv Et
                </span>
              </label>
            </div>

            {/* Categories Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Kateqoriya Görünməsi
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {category.image?.url && (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                      </div>
                    </div>

                    <select
                      value={categoryVisibility[category._id] ? "true" : "false"}
                      onChange={(e) => handleCategoryVisibilityChange(category._id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent outline-none cursor-pointer"
                    >
                      <option value="true">Göstər</option>
                      <option value="false">Gizlət</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/popular-categories")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-[#5C4977] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Yadda saxlanılır...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Yadda Saxla
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPopularCategories;

