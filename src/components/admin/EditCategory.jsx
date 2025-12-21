import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryQuery, useUpdateCategoryMutation } from "../../redux/api/categoryApi";
import Swal from "sweetalert2";
import { FaImage } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetCategoryQuery(id);
  const [updateCategory] = useUpdateCategoryMutation();

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (data?.category) {
      const category = data.category;
      setCategoryForm({
        name: category.name || "",
        slug: category.slug || "",
        image: null,
        imagePreview: category.image?.url || null,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: "Şəkil ölçüsü maksimum 5MB olmalıdır",
          icon: "warning",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
      setCategoryForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Kateqoriya adı tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name.trim());
      if (categoryForm.slug.trim()) {
        formData.append("slug", categoryForm.slug.trim());
      }
      if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      await updateCategory({ id, formData }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Kateqoriya uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/categories");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Kateqoriya yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Kateqoriyanı Redaktə Et">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Kateqoriyanı Redaktə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Kateqoriyanı Redaktə Et</h1>
                <p className="text-gray-600">Kateqoriya məlumatlarını yeniləyin</p>
              </div>
              <button
                onClick={() => navigate("/admin/categories")}
                className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri qayıt
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Əsas məlumatlar */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  Əsas Məlumatlar
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Kateqoriya Adı *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={categoryForm.name}
                      onChange={handleInputChange}
                      placeholder="Məs. Sırğalar"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Slug (URL üçün) <span className="text-gray-500 text-xs font-normal">(İstəyə bağlı)</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={categoryForm.slug}
                      onChange={handleInputChange}
                      placeholder="Məs. sirgalar"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">Boş buraxılsa, ad əsasında avtomatik yaradılacaq</p>
                  </div>
                </div>
              </div>

              {/* Şəkil */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Kateqoriya Şəkli
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Yeni şəkil seçin (Maksimum 5MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Şəkil Preview */}
                {categoryForm.imagePreview ? (
                  <div className="flex gap-4">
                    <div className="relative group w-32">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-[#5C4977]/20 group-hover:border-[#5C4977]/40 transition-colors">
                        <img
                          src={categoryForm.imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (categoryForm.imagePreview && categoryForm.imagePreview.startsWith('blob:')) {
                            URL.revokeObjectURL(categoryForm.imagePreview);
                          }
                          setCategoryForm((prev) => ({
                            ...prev,
                            image: null,
                            imagePreview: null,
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#5C4977]/20 rounded-xl bg-[#5C4977]/5">
                    <FaImage className="h-12 w-12 text-[#5C4977]/40 mb-4" />
                    <p className="text-[#5C4977]/70 text-center">
                      Heç bir şəkil əlavə edilməyib
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20"
              >
                <div className="flex items-center justify-center gap-2">
                  Yadda Saxla
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;




