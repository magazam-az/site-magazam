import React, { useState, useEffect } from "react";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import { useGetProductDetailsQuery, useEditProductMutation } from "../../redux/api/productsApi";
import Swal from "sweetalert2";
import { Loader2, Package, Plus, X } from "lucide-react";
import AdminLayout from "./AdminLayout";

const ProductAttributes = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [sizeAttribute, setSizeAttribute] = useState({
    name: "size",
    title: "Ölçü",
    units: [],
  });

  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery();
  const { data: productData, isLoading: isLoadingProduct } = useGetProductDetailsQuery(
    selectedProductId || "",
    { skip: !selectedProductId }
  );
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();

  const products = productsData?.products || [];
  const product = productData?.product;

  // Product seçildikdə attributes yüklə
  useEffect(() => {
    if (product && product.attributes && Array.isArray(product.attributes)) {
      const sizeAttr = product.attributes.find(attr => attr.name === 'size');
      if (sizeAttr) {
        setSizeAttribute({
          _id: sizeAttr._id,
          name: sizeAttr.name || 'size',
          title: sizeAttr.title || 'Ölçü',
          units: sizeAttr.units && Array.isArray(sizeAttr.units)
            ? sizeAttr.units.map(unit => ({
                _id: unit._id,
                name: unit.name || '',
                title: unit.title || '',
              }))
            : [],
        });
      } else {
        setSizeAttribute({
          name: "size",
          title: "Ölçü",
          units: [],
        });
      }
    } else if (product) {
      setSizeAttribute({
        name: "size",
        title: "Ölçü",
        units: [],
      });
    }
  }, [product]);

  const handleAddUnit = () => {
    const lastUnit = sizeAttribute.units[sizeAttribute.units.length - 1];
    if (lastUnit && lastUnit.name && lastUnit.title) {
      setSizeAttribute({
        ...sizeAttribute,
        units: [...sizeAttribute.units, { name: "", title: "" }],
      });
    } else if (sizeAttribute.units.length === 0) {
      setSizeAttribute({
        ...sizeAttribute,
        units: [{ name: "", title: "" }],
      });
    } else {
      Swal.fire({
        title: "Xəta",
        text: "Zəhmət olmasa name və title daxil edin",
        icon: "warning",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleRemoveUnit = (index) => {
    const newUnits = sizeAttribute.units.filter((_, i) => i !== index);
    setSizeAttribute({ ...sizeAttribute, units: newUnits });
  };

  const handleSave = async () => {
    if (!selectedProductId) {
      Swal.fire({
        title: "Xəta",
        text: "Zəhmət olmasa məhsul seçin",
        icon: "warning",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // Mövcud məhsul məlumatlarını saxla
      if (product) {
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
      }

      // Attributes hazırla
      const attributesToSend = [];
      if (sizeAttribute && sizeAttribute.units && sizeAttribute.units.length > 0) {
        const sizeUnits = sizeAttribute.units
          .filter(unit => unit.name && unit.title)
          .map(unit => ({
            _id: unit._id, // Mövcud unit-lərin _id-sini saxla
            name: unit.name,
            title: unit.title,
          }));
        
        if (sizeUnits.length > 0) {
          attributesToSend.push({
            _id: sizeAttribute._id, // Mövcud attribute-un _id-sini saxla
            name: sizeAttribute.name,
            title: sizeAttribute.title,
            units: sizeUnits,
          });
        }
      }

      // Digər attributes-ləri də əlavə et
      if (product && product.attributes && Array.isArray(product.attributes)) {
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
        id: selectedProductId,
        formData,
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Attributes uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });
    } catch (error) {
      console.error("❌ Xəta baş verdi:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Attributes yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoadingProducts) {
    return (
      <AdminLayout pageTitle="Məhsul Attributes">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Məhsul Attributes">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Məhsul Attributes İdarəetməsi</h1>
            <p className="text-gray-600">Məhsul seçib, həmin məhsula attributes (xüsusilə Ölçü) əlavə edin</p>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#5C4977] mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Məhsul Seçin
            </h2>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
            >
              <option value="">Məhsul seçin...</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - {product.brand} {product.model}
                </option>
              ))}
            </select>
          </div>

          {/* Attributes Management */}
          {selectedProductId && (
            <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6">
              {isLoadingProduct ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
                </div>
              ) : (
                <>
                  {product && (
                    <div className="mb-6 p-4 bg-[#5C4977]/5 rounded-xl">
                      <h3 className="font-semibold text-[#5C4977] mb-2">Seçilmiş Məhsul:</h3>
                      <p className="text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand} {product.model}</p>
                    </div>
                  )}

                  {/* Size Attribute */}
                  <div className="border-b border-[#5C4977]/10 pb-6 mb-6">
                    <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                      Ölçü (Size) Attribute
                    </h2>

                    <div className="space-y-4">
                      {/* Unit əlavə et */}
                      <div>
                        <label className="block text-sm font-medium text-[#5C4977] mb-2">
                          Unit əlavə et
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="name (məs: gb)"
                            value={sizeAttribute.units[sizeAttribute.units.length - 1]?.name || ""}
                            onChange={(e) => {
                              const newUnits = [...sizeAttribute.units];
                              if (newUnits.length > 0) {
                                newUnits[newUnits.length - 1] = {
                                  ...newUnits[newUnits.length - 1],
                                  name: e.target.value.toLowerCase().trim(),
                                };
                              } else {
                                newUnits.push({ name: e.target.value.toLowerCase().trim(), title: "" });
                              }
                              setSizeAttribute({ ...sizeAttribute, units: newUnits });
                            }}
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="title (məs: GB)"
                            value={sizeAttribute.units[sizeAttribute.units.length - 1]?.title || ""}
                            onChange={(e) => {
                              const newUnits = [...sizeAttribute.units];
                              if (newUnits.length > 0) {
                                newUnits[newUnits.length - 1] = {
                                  ...newUnits[newUnits.length - 1],
                                  title: e.target.value.trim(),
                                };
                              } else {
                                newUnits.push({ name: "", title: e.target.value.trim() });
                              }
                              setSizeAttribute({ ...sizeAttribute, units: newUnits });
                            }}
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddUnit}
                          className="mt-2 px-4 py-2 bg-[#5C4977] text-white rounded-xl hover:bg-[#5C4977]/90 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Unit əlavə et
                        </button>
                      </div>

                      {/* Seçilmiş units */}
                      {sizeAttribute.units.filter(u => u.name && u.title).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-[#5C4977] mb-2">
                            Seçilmiş Units:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sizeAttribute.units
                              .filter(u => u.name && u.title)
                              .map((unit, idx) => (
                                <span
                                  key={`${unit._id || unit.name}-${idx}`}
                                  className="inline-flex items-center gap-2 bg-[#5C4977] text-white px-3 py-1 rounded-full text-sm"
                                >
                                  {unit.name} ({unit.title})
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUnit(idx)}
                                    className="hover:text-red-200 cursor-pointer"
                                    title="Sil"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Yadda saxlanılır...
                      </>
                    ) : (
                      "Yadda Saxla"
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductAttributes;

