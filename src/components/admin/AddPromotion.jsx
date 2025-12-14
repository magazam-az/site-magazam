import React, { useState } from "react";
import {
  useCreatePromotionMutation,
  useGetPromotionsQuery,
} from "../../redux/api/promotionApi";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "./AdminLayout";
import MultiProductSelect from "./MultiProductSelect";

const AddPromotion = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    startDate: "",
    endDate: "",
    productTitle: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detailImage, setDetailImage] = useState(null);
  const [detailImagePreview, setDetailImagePreview] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
  const { refetch } = useGetPromotionsQuery();
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.products || [];
  const navigate = useNavigate();

  // Form input dəyişikliklərini state-ə ötür
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image seçimi
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // DetailImage seçimi
  const handleDetailImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDetailImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDetailImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDetailImage = () => {
    setDetailImage(null);
    setDetailImagePreview(null);
  };

  // Məhsul seçimi
  const handleProductChange = (selectedIds) => {
    setSelectedProducts(selectedIds);
  };

  // Form göndərmə
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Başlıq tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      Swal.fire({
        title: "Xəta!",
        text: "Başlanğıc və bitmə tarixləri tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!image) {
      Swal.fire({
        title: "Xəta!",
        text: "Promotion şəkli tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    const form = new FormData();
    
    // Formdakı məlumatları FormData-ya əlavə et
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "startDate" || key === "endDate") {
        form.append(key, new Date(value).toISOString());
      } else if (value) {
        form.append(key, value);
      }
    });

    // Şəkilləri əlavə et
    if (image) {
      form.append("image", image);
    }
    if (detailImage) {
      form.append("detailImage", detailImage);
    }

    // Məhsulları əlavə et
    if (selectedProducts.length > 0) {
      form.append("products", JSON.stringify(selectedProducts));
    }

    try {
      await createPromotion(form).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Promotion uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/promotions");
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Promotion əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Yeni Promotion">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Promotion Əlavə Et</h1>
                <p className="text-gray-600">Yeni promotion-un məlumatlarını daxil edin</p>
              </div>
              <button
                onClick={() => navigate("/admin/promotions")}
                className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri qayıt
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
              {/* Əsas məlumatlar */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  Əsas Məlumatlar
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Başlıq *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Promotion başlığı"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="promotion-slug-ornegi"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">URL üçün unikal slug</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Başlanğıc Tarixi *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Bitmə Tarixi *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Şəkillər */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Promotion Şəkilləri
                </h2>
                
                {/* Card Şəkli */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Promotion Card Şəkli * (Ana səhifədə göstəriləcək)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                      required
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative inline-block">
                      <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Detail Şəkli */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Detail Səhifə Şəkli (Promotion detail səhifəsində sağ tərəfdə göstəriləcək)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDetailImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                  </div>
                  {detailImagePreview && (
                    <div className="mt-4 relative inline-block">
                      <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                        <img
                          src={detailImagePreview}
                          alt="Detail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDetailImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Məhsullar */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6">
                  Məhsullar
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Məhsul Başlığı (Məhsullar bölməsi üçün başlıq)
                  </label>
                  <input
                    type="text"
                    name="productTitle"
                    value={formData.productTitle}
                    onChange={handleInputChange}
                    placeholder="Məs: Special Offer from Mega electronics"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Məhsulları seçin
                  </label>
                  <MultiProductSelect
                    products={products}
                    selectedProducts={selectedProducts}
                    onChange={handleProductChange}
                    placeholder="Məhsulları seçin..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Promotion əlavə edilir...
                  </div>
                ) : (
                  'Promotion Əlavə Et'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPromotion;
