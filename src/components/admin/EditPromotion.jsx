import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPromotionDetailsQuery, useUpdatePromotionMutation } from "../../redux/api/promotionApi";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import Swal from "sweetalert2";
import { FaImage } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "./AdminLayout";
import MultiProductSelect from "./MultiProductSelect";

const EditPromotion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetPromotionDetailsQuery(id);
  const [updatePromotion] = useUpdatePromotionMutation();
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.products || [];

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    startDate: "",
    endDate: "",
    productTitle: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [detailImage, setDetailImage] = useState(null);
  const [detailImagePreview, setDetailImagePreview] = useState(null);
  const [removeDetailImage, setRemoveDetailImage] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (data?.promotion) {
      const promotion = data.promotion;
      setFormData({
        title: promotion.title || "",
        slug: promotion.slug || "",
        startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "",
        endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : "",
        productTitle: promotion.productTitle || "",
      });
      setImagePreview(promotion.image?.url || null);
      setDetailImagePreview(promotion.detailImage?.url || null);
      setImage(null);
      setDetailImage(null);
      setRemoveImage(false);
      setRemoveDetailImage(false);
      // Products array-dən ID-ləri çıxar
      const productIds = promotion.products?.map(p => {
        if (typeof p === 'string') return p;
        return p._id || p;
      }) || [];
      setSelectedProducts(productIds);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image seçimi
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setRemoveImage(false);
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
    setRemoveImage(true);
  };

  // DetailImage seçimi
  const handleDetailImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDetailImage(file);
      setRemoveDetailImage(false);
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
    setRemoveDetailImage(true);
  };

  // Məhsul seçimi
  const handleProductChange = (selectedIds) => {
    setSelectedProducts(selectedIds);
  };

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

    try {
      const updatedData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "startDate" || key === "endDate") {
          updatedData.append(key, new Date(value).toISOString());
        } else if (value) {
          updatedData.append(key, value);
        }
      });

      // Şəkillər
      if (image) {
        updatedData.append("image", image);
      }
      if (removeImage) {
        updatedData.append("removeImage", "true");
      }
      if (detailImage) {
        updatedData.append("detailImage", detailImage);
      }
      if (removeDetailImage) {
        updatedData.append("removeDetailImage", "true");
      }

      // Məhsullar
      if (selectedProducts.length > 0) {
        updatedData.append("products", JSON.stringify(selectedProducts));
      }

      await updatePromotion({ id, promotionData: updatedData }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Promotion uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/promotions");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Promotion yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Promotion Redaktə Et">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4977]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Promotion Redaktə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Promotion Redaktə Et</h1>
                <p className="text-gray-600">Promotion-un məlumatlarını yeniləyin</p>
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
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    Promotion Card Şəkli
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
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
                    Detail Səhifə Şəkli
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
                    Məhsul Başlığı
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
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20"
              >
                Yadda Saxla
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPromotion;
