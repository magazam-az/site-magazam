import React, { useState } from "react";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import { useEditProductMutation } from "../../redux/api/productsApi";
import { useGetCategoriesQuery } from "../../redux/api/categoryApi";
import Swal from "sweetalert2";
import { Loader2, Edit, Trash2, Plus, X } from "lucide-react";
import AdminLayout from "./AdminLayout";

const ProductAttributes = () => {
  const { data: productsData, isLoading: isLoadingProducts, refetch } = useGetProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingUnits, setEditingUnits] = useState([]);

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  // Məhsulun kateqoriyasını tap
  const getCategoryName = (productCategory) => {
    const category = categories.find(cat => cat.name === productCategory);
    return category ? category.name : productCategory || "-";
  };

  // Məhsulun size attribute-unu tap
  const getSizeAttribute = (product) => {
    if (product.attributes && Array.isArray(product.attributes)) {
      return product.attributes.find(attr => attr.name === 'size');
    }
    return null;
  };

  // Redaktə rejiminə keç
  const handleEdit = (product) => {
    const sizeAttr = getSizeAttribute(product);
    setEditingProductId(product._id);
    setEditingUnits(
      sizeAttr && sizeAttr.units && Array.isArray(sizeAttr.units)
        ? [...sizeAttr.units]
        : []
    );
  };

  // Unit əlavə et (redaktə rejimində)
  const handleAddUnit = (productId) => {
    const lastUnit = editingUnits[editingUnits.length - 1];
    if (lastUnit && lastUnit.name && lastUnit.title) {
      setEditingUnits([...editingUnits, { name: "", title: "" }]);
    } else if (editingUnits.length === 0) {
      setEditingUnits([{ name: "", title: "" }]);
    } else {
      Swal.fire({
        title: "Xəta",
        text: "Zəhmət olmasa name və title daxil edin",
        icon: "warning",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  // Unit sil (redaktə rejimində)
  const handleRemoveUnit = (index) => {
    const newUnits = editingUnits.filter((_, i) => i !== index);
    setEditingUnits(newUnits);
  };

  // Unit dəyərlərini yenilə
  const handleUnitChange = (index, field, value) => {
    const newUnits = [...editingUnits];
    if (!newUnits[index]) {
      newUnits[index] = { name: "", title: "" };
    }
    newUnits[index][field] = field === 'name' ? value.toLowerCase().trim() : value.trim();
    setEditingUnits(newUnits);
  };

  // Yadda saxla
  const handleSave = async (product) => {
    try {
      const formData = new FormData();
      
      // Mövcud məhsul məlumatlarını saxla
      formData.append("name", product.name || "");
      formData.append("brand", product.brand || "");
      formData.append("model", product.model || "");
      formData.append("slug", product.slug || "");
      formData.append("price", product.price || "");
      formData.append("description", product.description || "");
      formData.append("category", product.category || "");
      formData.append("subcategory", product.subcategory || "");
      formData.append("stock", product.stock || "");
      
      // Keywords
      if (product.keywords && Array.isArray(product.keywords)) {
        product.keywords.forEach((kw) => {
          formData.append("keywords", kw);
        });
      }

      // Attributes hazırla
      const attributesToSend = [];
      
      // Size units hazırla
      const sizeUnits = editingUnits
        .filter(unit => unit.name && unit.title)
        .map(unit => ({
          _id: unit._id, // Mövcud unit-lərin _id-sini saxla
          name: unit.name,
          title: unit.title,
        }));
      
      if (sizeUnits.length > 0) {
        const existingSizeAttr = getSizeAttribute(product);
        attributesToSend.push({
          _id: existingSizeAttr?._id,
          name: "size",
          title: "Ölçü",
          units: sizeUnits,
        });
      }

      // Digər attributes-ləri də əlavə et
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach(attr => {
          if (attr.name !== 'size') {
            attributesToSend.push(attr);
          }
        });
      }

      if (attributesToSend.length > 0) {
        formData.append("attributes", JSON.stringify(attributesToSend));
      }

      await editProduct({
        id: product._id,
        formData,
      }).unwrap();

      setEditingProductId(null);
      setEditingUnits([]);
      refetch();

      Swal.fire({
        title: "Uğurlu!",
        text: "Ölçü vahidləri uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ Xəta baş verdi:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Ölçü vahidləri yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  // Ləğv et
  const handleCancel = () => {
    setEditingProductId(null);
    setEditingUnits([]);
  };

  // Unit-ləri sil
  const handleDeleteUnits = async (product) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu məhsulun ölçü vahidlərini silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        
        // Mövcud məhsul məlumatlarını saxla
        formData.append("name", product.name || "");
        formData.append("brand", product.brand || "");
        formData.append("model", product.model || "");
        formData.append("slug", product.slug || "");
        formData.append("price", product.price || "");
        formData.append("description", product.description || "");
        formData.append("category", product.category || "");
        formData.append("subcategory", product.subcategory || "");
        formData.append("stock", product.stock || "");
        
        // Keywords
        if (product.keywords && Array.isArray(product.keywords)) {
          product.keywords.forEach((kw) => {
            formData.append("keywords", kw);
          });
        }

        // Digər attributes-ləri saxla (size-sız)
        const attributesToSend = [];
        if (product.attributes && Array.isArray(product.attributes)) {
          product.attributes.forEach(attr => {
            if (attr.name !== 'size') {
              attributesToSend.push(attr);
            }
          });
        }

        if (attributesToSend.length > 0) {
          formData.append("attributes", JSON.stringify(attributesToSend));
        }

        await editProduct({
          id: product._id,
          formData,
        }).unwrap();

        refetch();

        Swal.fire({
          title: "Silindi!",
          text: "Ölçü vahidləri uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Ölçü vahidləri silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  if (isLoadingProducts) {
    return (
      <AdminLayout pageTitle="Ölçü Vahidləri">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Ölçü Vahidləri">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Ölçü Vahidləri İdarəetməsi</h1>
            <p className="text-gray-600">Məhsulların ölçü vahidlərini idarə edin</p>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Məhsul</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Kateqoriya</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Ölçü (Size)</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const sizeAttr = getSizeAttribute(product);
                    const isEditing = editingProductId === product._id;
                    const units = isEditing ? editingUnits : (sizeAttr?.units || []);

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} {product.model}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">{getCategoryName(product.category)}</div>
                        </td>
                        <td className="py-4 px-4">
                          {isEditing ? (
                            <div className="space-y-2">
                              {/* Unit əlavə et */}
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="name (məs: gb)"
                                  value={units[units.length - 1]?.name || ""}
                                  onChange={(e) => {
                                    const lastIndex = units.length - 1;
                                    if (lastIndex >= 0) {
                                      handleUnitChange(lastIndex, 'name', e.target.value);
                                    } else {
                                      handleUnitChange(0, 'name', e.target.value);
                                    }
                                  }}
                                  className="w-full p-2 text-sm border border-[#5C4977]/20 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                                />
                                <input
                                  type="text"
                                  placeholder="title (məs: GB)"
                                  value={units[units.length - 1]?.title || ""}
                                  onChange={(e) => {
                                    const lastIndex = units.length - 1;
                                    if (lastIndex >= 0) {
                                      handleUnitChange(lastIndex, 'title', e.target.value);
                                    } else {
                                      handleUnitChange(0, 'title', e.target.value);
                                    }
                                  }}
                                  className="w-full p-2 text-sm border border-[#5C4977]/20 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddUnit(product._id)}
                                className="text-xs px-3 py-1 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Unit əlavə et
                              </button>
                              {/* Seçilmiş units */}
                              {units.filter(u => u.name && u.title).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {units
                                    .filter(u => u.name && u.title)
                                    .map((unit, idx) => (
                                      <span
                                        key={`${unit._id || unit.name}-${idx}`}
                                        className="inline-flex items-center gap-1 bg-[#5C4977] text-white px-2 py-1 rounded text-xs"
                                      >
                                        {unit.name} ({unit.title})
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveUnit(idx)}
                                          className="hover:text-red-200 cursor-pointer"
                                          title="Sil"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {units.length > 0 ? (
                                units.map((unit, idx) => (
                                  <span
                                    key={`${unit._id || unit.name}-${idx}`}
                                    className="inline-flex items-center bg-[#5C4977]/10 text-[#5C4977] px-2 py-1 rounded text-xs"
                                  >
                                    {unit.name} ({unit.title})
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSave(product)}
                                disabled={isUpdating}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Yadda saxla"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <span className="text-xs font-medium">Yadda saxla</span>
                                )}
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Ləğv et"
                              >
                                <span className="text-xs font-medium">Ləğv et</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                                title="Redaktə et"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {sizeAttr && sizeAttr.units && sizeAttr.units.length > 0 && (
                                <button
                                  onClick={() => handleDeleteUnits(product)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Ölçü vahidlərini sil"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Heç bir məhsul tapılmadı
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductAttributes;
