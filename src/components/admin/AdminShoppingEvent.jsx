import React, { useState, useEffect, useMemo } from "react";
import { useGetShoppingEventAdminQuery, useUpdateShoppingEventMutation } from "../../redux/api/shoppingEventApi";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import AdminLayout from "./AdminLayout";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const AdminShoppingEvent = ({ withoutLayout = false, onClose = null }) => {
  const { data: shoppingEventData, isLoading: isLoadingEvent, refetch } = useGetShoppingEventAdminQuery();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery();
  const [updateShoppingEvent, { isLoading: isUpdating }] = useUpdateShoppingEventMutation();

  const shoppingEvent = shoppingEventData?.shoppingEvent;
  const allProducts = productsData?.products || [];

  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
  const [deviceImage, setDeviceImage] = useState(null);
  const [deviceImagePreview, setDeviceImagePreview] = useState(null);

  // ShoppingEvent data gəldikdə state-ləri doldur
  useEffect(() => {
    if (shoppingEvent) {
      setTitle(shoppingEvent.title || "");
      setDescription(shoppingEvent.description || "");
      
      // endDate-i ISO formatında set et
      if (shoppingEvent.endDate) {
        const date = new Date(shoppingEvent.endDate);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setEndDate(localDate.toISOString().slice(0, 16)); // YYYY-MM-DDTHH:mm formatı
      }
      
      setButtonText(shoppingEvent.buttonText || "");
      setSelectedProductIds(shoppingEvent.selectedProductIds?.map(id => id.toString()) || []);
      setIsActive(shoppingEvent.isActive !== undefined ? shoppingEvent.isActive : true);
      setBackgroundImagePreview(shoppingEvent.backgroundImage?.url || null);
      setDeviceImagePreview(shoppingEvent.deviceImage?.url || null);
    }
  }, [shoppingEvent]);

  // Background image handler
  const handleBackgroundImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Device image handler
  const handleDeviceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDeviceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeviceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle product selection
  const toggleProduct = (productId) => {
    const idStr = productId.toString();
    setSelectedProductIds(prev => 
      prev.includes(idStr) 
        ? prev.filter(id => id !== idStr)
        : [...prev, idStr]
    );
  };

  // Select All / Deselect All
  const handleSelectAll = () => {
    const filteredProducts = allProducts.filter(product => {
      if (!productSearchTerm) return true;
      const searchLower = productSearchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.model?.toLowerCase().includes(searchLower)
      );
    });
    
    const filteredIds = filteredProducts.map(p => p._id.toString());
    const allFilteredSelected = filteredIds.every(id => selectedProductIds.includes(id));
    
    if (allFilteredSelected) {
      // Deselect all filtered
      setSelectedProductIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      setSelectedProductIds(prev => {
        const newIds = [...prev];
        filteredIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Başlıq tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!description.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Təsvir tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!endDate) {
      Swal.fire({
        title: "Xəta!",
        text: "Bitmə tarixi tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (!buttonText.trim()) {
      Swal.fire({
        title: "Xəta!",
        text: "Düymə mətni tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // Text fields
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("endDate", new Date(endDate).toISOString());
      formData.append("buttonText", buttonText.trim());
      formData.append("selectedProductIds", JSON.stringify(selectedProductIds));
      formData.append("isActive", isActive.toString());

      // Images
      if (backgroundImage) {
        formData.append("backgroundImage", backgroundImage);
      }
      if (deviceImage) {
        formData.append("deviceImage", deviceImage);
      }

      await updateShoppingEvent(formData).unwrap();
      
      Swal.fire({
        title: "Uğurlu!",
        text: "Shopping Event uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });
      
      refetch();
      
      // If in modal mode (withoutLayout), close the modal after success
      if (withoutLayout) {
        handleSuccess();
      }
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.message || "Shopping Event yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      if (!productSearchTerm) return true;
      const searchLower = productSearchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.model?.toLowerCase().includes(searchLower)
      );
    });
  }, [allProducts, productSearchTerm]);

  // Check if all filtered products are selected
  const allFilteredSelected = useMemo(() => {
    if (filteredProducts.length === 0) return false;
    return filteredProducts.every(product => selectedProductIds.includes(product._id.toString()));
  }, [filteredProducts, selectedProductIds]);

  // Handle close callback
  const handleSuccess = () => {
    if (onClose) {
      onClose();
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlıq *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Apple Shopping Event"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Təsvir *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hurry and get discounts on all Apple devices up to 20%"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitmə Tarixi (Geri Sayım) *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                required
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Düymə Mətni *
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Go Shopping"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                required
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Şəkil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
              />
              {backgroundImagePreview && (
                <div className="mt-4">
                  <img
                    src={backgroundImagePreview}
                    alt="Background preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Device Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Şəkil (Soldakı Şəkil)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleDeviceImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
              />
              {deviceImagePreview && (
                <div className="mt-4">
                  <img
                    src={deviceImagePreview}
                    alt="Device preview"
                    className="w-full max-w-md h-48 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Məhsulları Seçin
                </label>
                {filteredProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-[#5C4977] hover:underline font-medium"
                  >
                    {allFilteredSelected ? "Hamısını Ləğv Et" : "Hamısını Seç"}
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Məhsul axtar..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                />
              </div>

              {/* Products List */}
              <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Məhsul tapılmadı</p>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedProductIds.includes(product._id.toString());
                      return (
                        <label
                          key={product._id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product._id)}
                            className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={
                                product.images?.[0]?.url ||
                                product.image ||
                                "https://placehold.co/60x60/6B7280/ffffff?text=No+Image"
                              }
                              alt={product.name}
                              className="w-12 h-12 object-contain rounded border border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/60x60/6B7280/ffffff?text=No+Image";
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.brand} {product.model && `- ${product.model}`}
                              </p>
                              <p className="text-sm font-semibold text-[#5C4977]">
                                {typeof product.price === 'number'
                                  ? `${product.price.toFixed(2)} ₼`
                                  : product.price || '0.00 ₼'}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedProductIds.length > 0 && (
                <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                  <p className="text-sm font-medium text-[#5C4977]">
                    Seçilmiş məhsul sayı: {selectedProductIds.length}
                  </p>
                </div>
              )}
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Aktiv olsun
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-[#5C4977] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Yaddaşda saxlanılır...
                  </>
                ) : (
                  "Yaddaşda Saxla"
                )}
              </button>
            </div>
          </form>
  );

  if (isLoadingEvent || isLoadingProducts) {
    const loadingContent = (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
      </div>
    );

    if (withoutLayout) {
      return loadingContent;
    }

    return (
      <AdminLayout pageTitle="Shopping Event">
        {loadingContent}
      </AdminLayout>
    );
  }

  if (withoutLayout) {
    return formContent;
  }

  return (
    <AdminLayout pageTitle="Shopping Event">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Shopping Event İdarəetməsi</h1>
            <p className="text-gray-600">Shopping Event məlumatlarını idarə edin</p>
          </div>
          {formContent}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminShoppingEvent;

