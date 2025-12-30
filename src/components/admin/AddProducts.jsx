import React, { useState } from "react";
import { useAddProductMutation } from "../../redux/api/productsApi";
import { useGetCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetBrandsQuery } from "../../redux/api/brandApi";
import { useGetSpecsQuery } from "../../redux/api/specApi";
import { useGetUnitsQuery } from "../../redux/api/unitApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaImage, FaTag, FaInfoCircle, FaUpload, FaStar, FaTrash, FaBoxOpen, FaTimes } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Loader2, X } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    slug: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
    keywords: [], // ✅ ARRAY
    attributes: [], // ✅ Attributes array
  });

  // ✅ keyword input (tag əlavə etmək üçün)
  const [keywordInput, setKeywordInput] = useState("");

  // Xüsusiyyətlər üçün repeater field state - array of { specId, name, value, unit, tempId }
  const [specFields, setSpecFields] = useState([]);
  
  // Temp ID generator
  const [tempIdCounter, setTempIdCounter] = useState(0);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const { data: brandsData } = useGetBrandsQuery();
  const brands = brandsData?.brands || [];

  const { data: specsData } = useGetSpecsQuery();
  const allSpecs = specsData?.specs || [];

  // Seçilmiş kateqoriyanın alt kateqoriyalarını tap
  const selectedCategory = categories.find((cat) => cat.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];
  
  // Seçilmiş kateqoriyanın xüsusiyyətlərini yüklə
  const categorySpecs = selectedCategory?.specs || [];

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Tab state
  const [activeTab, setActiveTab] = useState("basic");

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  // Slug generate funksiyası (backend-dəki kimi)
  const generateSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[ə]/g, 'e')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ü]/g, 'u')
      .replace(/[ğ]/g, 'g')
      .replace(/[ş]/g, 's')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "category") {
        return { ...prev, [name]: value, subcategory: "" };
      }
      // Həmişə name dəyişdikdə slug-u avtomatik generate et
      if (name === "name") {
        const autoSlug = generateSlug(value);
        return { ...prev, [name]: value, slug: autoSlug };
      }
      return { ...prev, [name]: value };
    });
  };

  // ✅ KEYWORDS: + əlavə et
  const addKeyword = () => {
    const kw = (keywordInput || "").trim();
    if (!kw) return;

    // duplicate olmasın (case-insensitive)
    const exists = (formData.keywords || []).some(
      (x) => String(x).toLowerCase() === kw.toLowerCase()
    );
    if (exists) {
      setKeywordInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      keywords: [...(prev.keywords || []), kw],
    }));
    setKeywordInput("");
  };

  // ✅ KEYWORDS: sil
  const removeKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      keywords: (prev.keywords || []).filter((_, i) => i !== index),
    }));
  };

  const onKeywordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  // Yeni xüsusiyyət field əlavə et
  const handleAddSpecField = () => {
    const newField = {
      tempId: tempIdCounter,
      specId: "",
      name: "",
      value: "",
      unit: "",
    };
    setSpecFields((prev) => [...prev, newField]);
    setTempIdCounter((prev) => prev + 1);
  };

  // Xüsusiyyət field sil
  const handleRemoveSpecField = (tempId) => {
    setSpecFields((prev) => prev.filter((field) => field.tempId !== tempId));
  };

  // Xüsusiyyət field dəyişikliyi
  const handleSpecFieldChange = (tempId, field, value) => {
    setSpecFields((prev) =>
      prev.map((item) => {
        if (item.tempId === tempId) {
          const updated = { ...item, [field]: value };
          // Əgər specId dəyişirsə, unit-i yenilə və select tipi üçün value-nu array et
          if (field === "specId") {
            const spec = allSpecs.find((s) => s._id === value);
            if (spec && spec.unit) {
              updated.unit = spec.unit._id || spec.unit;
            } else {
              updated.unit = "";
            }
            // Select tipi üçün value-nu array et
            if (spec && spec.type === "select") {
              updated.value = [];
            } else {
              updated.value = "";
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Select tipi üçün dəyər toggle et (multiple select)
  const handleSelectValueToggle = (tempId, selectValueName) => {
    setSpecFields((prev) =>
      prev.map((item) => {
        if (item.tempId === tempId) {
          const currentValues = Array.isArray(item.value) ? item.value : [];
          const isSelected = currentValues.includes(selectValueName);
          const updatedValues = isSelected
            ? currentValues.filter((v) => v !== selectValueName)
            : [...currentValues, selectValueName];
          return { ...item, value: updatedValues, saved: false };
        }
        return item;
      })
    );
  };

  // Xüsusiyyət field save et
  const handleSaveSpecField = (tempId) => {
    const field = specFields.find((f) => f.tempId === tempId);
    if (!field) return;

    // Validasiya
    if (!field.specId) {
      Swal.fire({
        title: "Xəta!",
        text: "Xüsusiyyət seçilməlidir",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    const spec = allSpecs.find((s) => s._id === field.specId);
    if (!spec) return;

    // Dəyər validasiyası
    if (spec.type === "select") {
      // Select tipi üçün array yoxla
      if (!Array.isArray(field.value) || field.value.length === 0) {
        Swal.fire({
          title: "Xəta!",
          text: "Ən azı bir dəyər seçilməlidir",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    } else if (spec.type !== "boolean") {
      if (!field.value || !field.value.toString().trim()) {
        Swal.fire({
          title: "Xəta!",
          text: "Dəyər doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    // Number tipi üçün rəqəm yoxla
    if (spec.type === "number" && isNaN(field.value)) {
      Swal.fire({
        title: "Xəta!",
        text: "Rəqəm daxil edin",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    // Boolean tipi üçün validasiya
    if (spec.type === "boolean" && (field.value !== "true" && field.value !== "false" && field.value !== true && field.value !== false)) {
      Swal.fire({
        title: "Xəta!",
        text: "Dəyər seçilməlidir",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    // Ad validasiyası - select tipi üçün tələb olunmur (spec.name istifadə olunur)
    if (spec.type !== "select") {
      if (!field.name || !field.name.toString().trim()) {
        Swal.fire({
          title: "Xəta!",
          text: "Ad doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      // Eyni name-də ikinci dəyər olub-olmadığını yoxla
      const trimmedName = field.name.toString().trim();
      const duplicateName = specFields.find(
        (f) => 
          f.tempId !== tempId && 
          f.saved && 
          f.name && 
          f.name.toString().trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (duplicateName) {
        Swal.fire({
          title: "Xəta!",
          text: `"${trimmedName}" adında xüsusiyyət artıq mövcuddur. Eyni adda ikinci dəyər əlavə etmək olmaz.`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    // Boolean üçün dəyəri çevir
    let finalValue = field.value;
    if (spec.type === "boolean") {
      finalValue = field.value === "true" || field.value === true;
    }
    // Select tipi üçün array-i saxla
    if (spec.type === "select" && Array.isArray(field.value)) {
      finalValue = field.value;
    }

    // Field-i save edilmiş kimi işarələ
    setSpecFields((prev) =>
      prev.map((item) =>
        item.tempId === tempId
          ? { ...item, saved: true, value: finalValue }
          : item
      )
    );

    // Toast mesajı göstər
    toast.success("Xüsusiyyət saxlanıldı");
  };

  // Xüsusiyyət field-i edit rejiminə keçir
  const handleEditSpecField = (tempId) => {
    setSpecFields((prev) =>
      prev.map((item) =>
        item.tempId === tempId
          ? { ...item, saved: false }
          : item
      )
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil əlavə edə bilərsiniz",
        icon: "warning",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning",
          confirmButtonColor: "#5C4977",
        });
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (previews[index] && previews[index].startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);

    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Ad",
      brand: "Brend",
      model: "Model",
      price: "Qiymət",
      description: "Açıqlama",
      category: "Kateqoriya",
      stock: "Stok",
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `${fieldName} sahəsi tələb olunur`;
      }
    }

    if (formData.category && subcategories.length > 0 && !formData.subcategory) {
      return "Alt kateqoriya seçilməlidir";
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      return "Qiymət düzgün formatda olmalıdır";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      return "Stok miqdarı düzgün formatda olmalıdır";
    }

    if (images.length === 0) {
      return "Ən azı bir şəkil əlavə edilməlidir";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        title: "Xəta",
        text: validationError,
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      // ✅ normal field-lər
      Object.entries(formData).forEach(([key, value]) => {
        // keywords və attributes array-ləri burda append ETMİRİK (aşağıda ayrıca edəcəyik)
        if (key === "keywords" || key === "attributes") return;

        if (key === "subcategory") {
          if (value && value.toString().trim() !== "") {
            formDataToSend.append(key, value.toString().trim());
          }
          return;
        }

        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      // ✅ keywords array kimi göndər (FormData-da eyni key bir neçə dəfə -> backenddə array olur)
      if (Array.isArray(formData.keywords) && formData.keywords.length > 0) {
        formData.keywords.forEach((kw) => {
          if (kw && kw.toString().trim() !== "") {
            formDataToSend.append("keywords", kw.toString().trim());
          }
        });
      }

      // ✅ Attributes array kimi göndər (JSON string kimi)
      // Attributes-lər artıq ayrı səhifədə idarə olunur (ProductAttributes)
      if (Array.isArray(formData.attributes) && formData.attributes.length > 0) {
        formDataToSend.append("attributes", JSON.stringify(formData.attributes));
      }

      // Seçilmiş specs - specFields-dən selectedSpecs formatına çevir
      const savedSpecFields = specFields.filter((f) => f.saved && f.specId);
      if (savedSpecFields.length > 0) {
        const specsToSend = {};
        savedSpecFields.forEach((field) => {
          const spec = allSpecs.find((s) => s._id === field.specId);
          if (spec) {
            const specName = spec.name || spec.title;
            if (!specsToSend[specName]) {
              specsToSend[specName] = [];
            }
            // Select tipi üçün hər bir seçilmiş dəyər üçün ayrı specValue yarat
            if (spec.type === "select" && Array.isArray(field.value)) {
              field.value.forEach((selectedValueName) => {
                // spec.selectValues-dən title tap
                const selectValue = spec.selectValues?.find((sv) => sv.name === selectedValueName);
                const specValue = {
                  value: selectValue?.title || selectedValueName,
                  name: selectValue?.name || selectedValueName,
                };
                if (field.unit) {
                  specValue.unit = field.unit;
                }
                specsToSend[specName].push(specValue);
              });
            } else {
              const specValue = {
                value: field.value,
                name: field.name,
              };
              if (field.unit) {
                specValue.unit = field.unit;
              }
              specsToSend[specName].push(specValue);
            }
          }
        });
        if (Object.keys(specsToSend).length > 0) {
          formDataToSend.append("specs", JSON.stringify(specsToSend));
        }
      }

      formDataToSend.append("mainImageIndex", mainImageIndex.toString());

      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await addProduct(formDataToSend).unwrap();

      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      setFormData({
        name: "",
        brand: "",
        model: "",
        slug: "",
        price: "",
        description: "",
        category: "",
        subcategory: "",
        stock: "",
        keywords: [],
        attributes: [],
      });
      setKeywordInput("");
      setSpecFields([]);
      setTempIdCounter(0);
      setImages([]);
      setPreviews([]);
      setMainImageIndex(0);

      // Birbaşa listəyə yönləndir (modal göstərilmir)
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Xəta baş verdi:", error);

      let errorMessage = "Məhsul əlavə edilərkən xəta baş verdi";

      if (error?.data?.error) errorMessage = error.data.error;
      else if (error?.data?.message) errorMessage = error.data.message;
      else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Serverlə əlaqə problemi. Zəhmət olmasa bir daha yoxlayın.";
      } else if (error?.status === 500) {
        errorMessage = "Server xətası. Məlumatların düzgünlüyünü yoxlayın.";
      }

      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Başa düşdüm",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Yeni Məhsul Əlavə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Məhsul Əlavə Et</h1>
                <p className="text-gray-600">Yeni məhsulun məlumatlarını daxil edin</p>
              </div>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl cursor-pointer"
              >
                Geri qayıt
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 md:p-8">
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-[#5C4977]/10">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === "basic"
                      ? "border-[#5C4977] text-[#5C4977]"
                      : "border-transparent text-gray-500 hover:text-[#5C4977]"
                  } cursor-pointer`}
                >
                  Əsas yarat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("features")}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === "features"
                      ? "border-[#5C4977] text-[#5C4977]"
                      : "border-transparent text-gray-500 hover:text-[#5C4977]"
                  } cursor-pointer`}
                >
                  Xüsusiyyətlər yarat
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Əsas məlumatlar - Basic Tab */}
              {activeTab === "basic" && (
                <>
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaInfoCircle className="h-5 w-5" />
                  Əsas Məlumatlar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Məhsul Adı *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Məhsul adını daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Brend *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Brend seçin</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Model *</label>
                    <input
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="Model adını daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Slug (URL üçün) <span className="text-gray-500 text-xs font-normal">(Avtomatik yaradılır)</span>
                    </label>
                    <input
                      name="slug"
                      value={formData.slug}
                      placeholder="Məs. iphone-15-pro-max"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl bg-gray-50 cursor-not-allowed transition-colors"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Slug məhsul adı əsasında avtomatik yaradılır</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Qiymət (AZN) *</label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Qiyməti daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Stok Miqdarı *</label>
                    <input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="Stok miqdarını daxil edin"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">Kateqoriya *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Kateqoriya seçin</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.category && subcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">Alt Kateqoriya *</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      >
                        <option value="">Alt kateqoriya seçin</option>
                        {subcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory.name}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Açıqlama */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaBoxOpen className="h-5 w-5" />
                  Açıqlama
                </h2>
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">Məhsul Haqqında *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Məhsul haqqında ətraflı məlumat yazın..."
                    rows="4"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* ✅ Açar Sözlər (TAG + / ×) */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaTag className="h-5 w-5" />
                  Açar Sözlər
                </h2>

                <label className="block text-sm font-medium text-[#5C4977] mb-2">
                  Keyword əlavə et
                </label>

                <div className="flex gap-2">
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={onKeywordKeyDown}
                    placeholder="məs: telefon, android, 5G..."
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-5 rounded-xl border border-[#5C4977] text-[#5C4977] hover:bg-[#5C4977]/5 transition-colors cursor-pointer"
                    title="Əlavə et"
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Enter basaraq da keyword əlavə edə bilərsiniz.
                </p>

                {Array.isArray(formData.keywords) && formData.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.keywords.map((kw, idx) => (
                      <span
                        key={`${kw}-${idx}`}
                        className="inline-flex items-center gap-2 bg-[#5C4977] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(idx)}
                          className="hover:text-red-200 cursor-pointer"
                          title="Sil"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Şəkillər - Basic Tab */}
              <div className="pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Məhsul Şəkilləri
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Şəkilləri seçin (Maksimum 6 şəkil)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={images.length >= 6}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 disabled:opacity-50 cursor-pointer"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <HiOutlinePhotograph className="h-5 w-5 text-[#5C4977]/60" />
                    </div>
                  </div>
                </div>

                {/* Əsas Şəkil */}
                {previews.length > 0 && (
                  <div className="mb-6 p-4 border-2 border-green-500 rounded-xl bg-green-50">
                    <div className="flex items-center gap-4">
                      <img
                        src={previews[mainImageIndex]}
                        alt="Əsas şəkil"
                        className="w-32 h-32 object-cover border-2 border-green-500 rounded-lg shadow-md"
                      />
                      <div>
                        <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                          <FaStar className="h-3 w-3" />
                          Əsas Şəkil
                        </div>
                        <p className="text-sm text-gray-600">
                          Bu şəkil məhsulun ön şəkili kimi göstəriləcək
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Şəkil Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {previews.length > 0 ? (
                    previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-[#5C4977]/20 group-hover:border-[#5C4977]/40 transition-colors">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        </div>

                        {index === mainImageIndex && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Əsas
                          </div>
                        )}

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index !== mainImageIndex && (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(index)}
                              className="bg-[#5C4977] hover:bg-[#5C4977]/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                              title="Əsas şəkil et"
                            >
                              <FaStar className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                            title="Sil"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#5C4977]/20 rounded-xl bg-[#5C4977]/5">
                      <FaImage className="h-12 w-12 text-[#5C4977]/40 mb-4" />
                      <p className="text-[#5C4977]/70 text-center">Heç bir şəkil əlavə edilməyib</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    {previews.length}/6 şəkil əlavə edilib • Maksimum ölçü: 5MB
                  </p>
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    disabled={images.length >= 6}
                    className="text-sm text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FaUpload className="inline mr-1 h-4 w-4" />
                    Şəkil əlavə et
                  </button>
                </div>
              </div>
                </>
              )}

              {/* Xüsusiyyətlər - Features Tab */}
              {activeTab === "features" && formData.category && categorySpecs.length > 0 && (
                <div className="border-b border-[#5C4977]/10 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#5C4977] flex items-center gap-2">
                      <FaTag className="h-5 w-5" />
                      Xüsusiyyətlər
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddSpecField}
                      className="px-4 py-2 bg-[#5C4977] text-white rounded-xl hover:bg-[#5C4977]/90 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-lg">+</span>
                      Xüsusiyyət əlavə et
                    </button>
                  </div>

                  <div className="space-y-4">
                    {specFields.map((field) => {
                      const spec = allSpecs.find((s) => s._id === field.specId);
                      const isSaved = field.saved;

                      return (
                        <div
                          key={field.tempId}
                          className={`border border-[#5C4977]/20 rounded-xl p-4 ${
                            isSaved ? "bg-green-50/50" : "bg-white"
                          }`}
                        >
                          {isSaved ? (
                            // Save edilmiş xüsusiyyət - disabled formada göstərmə rejimi
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                {/* Xüsusiyyət - disabled */}
                                <div className="md:col-span-3">
                                  <label className="block text-sm font-medium text-[#5C4977] mb-1.5">
                                    Xüsusiyyət
                                  </label>
                                  <input
                                    type="text"
                                    value={spec ? (spec.title || spec.name) : ""}
                                    disabled
                                    className="w-full p-2.5 border border-[#5C4977]/20 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 text-sm"
                                  />
                                </div>

                                {/* Ad - disabled (select tipi üçün gizlə) */}
                                {spec && spec.type !== "select" && (
                                  <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-[#5C4977] mb-1.5">
                                      Ad
                                    </label>
                                    <input
                                      type="text"
                                      value={field.name}
                                      disabled
                                      className="w-full p-2.5 border border-[#5C4977]/20 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 text-sm"
                                    />
                                  </div>
                                )}

                                {/* Dəyər - disabled */}
                                <div className="md:col-span-4">
                                  <label className="block text-sm font-medium text-[#5C4977] mb-1.5">
                                    Dəyər
                                  </label>
                                  {spec && spec.type === "select" ? (
                                    <div className="flex flex-wrap gap-2 border border-[#5C4977]/20 rounded-lg bg-gray-50 p-2">
                                      {Array.isArray(field.value) && field.value.length > 0 ? (
                                        <>
                                          {field.value.slice(0, 3).map((selectedValueName, idx) => {
                                            const selectValue = spec.selectValues?.find((sv) => sv.name === selectedValueName);
                                            return (
                                              <span key={idx} className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-200 whitespace-nowrap">
                                                {selectValue ? selectValue.title : selectedValueName}
                                              </span>
                                            );
                                          })}
                                          {field.value.length > 3 && (
                                            <span className="px-2 py-1 text-xs text-gray-500 font-medium">
                                              +{field.value.length - 3} ...
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <span className="text-sm text-gray-500 italic">Seçilməyib</span>
                                      )}
                                    </div>
                                  ) : spec && spec.type === "boolean" ? (
                                    <select
                                      value={field.value}
                                      disabled
                                      className="w-full p-2.5 border border-[#5C4977]/20 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 text-sm"
                                    >
                                      <option value={field.value}>
                                        {field.value === true || field.value === "true" ? "Bəli" : "Xeyr"}
                                      </option>
                                    </select>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <input
                                        type={spec && spec.type === "number" ? "number" : "text"}
                                        value={field.value}
                                        disabled
                                        className="flex-1 p-2.5 border border-[#5C4977]/20 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700 text-sm"
                                      />
                                      {spec?.unit && (
                                        <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                                          {typeof spec.unit === "object" ? (spec.unit.title || spec.unit.name) : spec.unit}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Əməliyyatlar - row sonunda, düzgün hizalanmış */}
                                <div className="md:col-span-2 flex items-end gap-2 h-[42px]">
                                  <button
                                    type="button"
                                    onClick={() => handleEditSpecField(field.tempId)}
                                    className="flex-1 px-3 py-2 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-all duration-200 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                                    title="Düzəliş"
                                  >
                                    <span className="text-sm">✎</span>
                                    <span>Düzəliş</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecField(field.tempId)}
                                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                                    title="Sil"
                                  >
                                    <FaTrash className="h-3.5 w-3.5" />
                                    <span>Sil</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Yeni/redaktə rejimi
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Xüsusiyyət seçimi */}
                                <div>
                                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                                    Xüsusiyyət *
                                  </label>
                                  <select
                                    value={field.specId}
                                    onChange={(e) =>
                                      handleSpecFieldChange(field.tempId, "specId", e.target.value)
                                    }
                                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                                  >
                                    <option value="">Xüsusiyyət seçin</option>
                                    {categorySpecs.map((specRef) => {
                                      const specOption = allSpecs.find(
                                        (s) => s._id === (specRef._id || specRef)
                                      );
                                      if (!specOption) return null;
                                      return (
                                        <option key={specOption._id} value={specOption._id}>
                                          {specOption.title || specOption.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>

                                {/* Ad - select tipi üçün gizlə */}
                                {spec && spec.type !== "select" && (
                                  <div>
                                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                                      Ad *
                                    </label>
                                    <input
                                      type="text"
                                      value={field.name}
                                      onChange={(e) =>
                                        handleSpecFieldChange(field.tempId, "name", e.target.value)
                                      }
                                      placeholder="Məs. Mavi"
                                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                                    />
                                  </div>
                                )}

                                {/* Dəyər */}
                                <div>
                                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                                    Dəyər *
                                  </label>
                                  {spec && spec.type === "select" ? (
                                    <div className="flex flex-wrap gap-2 border border-[#5C4977]/20 rounded-xl p-3">
                                      {spec.selectValues && spec.selectValues.length > 0 ? (
                                        <>
                                          {spec.selectValues.slice(0, 3).map((selectValue, idx) => {
                                            const isSelected = Array.isArray(field.value) && field.value.includes(selectValue.name);
                                            return (
                                              <label
                                                key={idx}
                                                className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-lg text-xs cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isSelected}
                                                  onChange={() => handleSelectValueToggle(field.tempId, selectValue.name)}
                                                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer"
                                                />
                                                <span className={isSelected ? "text-[#5C4977] font-medium whitespace-nowrap" : "text-gray-800 whitespace-nowrap"}>
                                                  {selectValue.title}
                                                </span>
                                              </label>
                                            );
                                          })}
                                          {spec.selectValues.length > 3 && (
                                            <span className="px-2 py-1.5 text-xs text-gray-500 font-medium">
                                              +{spec.selectValues.length - 3} ...
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <p className="text-sm text-gray-500 italic">Bu xüsusiyyət üçün dəyər tapılmadı</p>
                                      )}
                                    </div>
                                  ) : spec && spec.type === "boolean" ? (
                                    <select
                                      value={field.value}
                                      onChange={(e) =>
                                        handleSpecFieldChange(field.tempId, "value", e.target.value)
                                      }
                                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                                    >
                                      <option value="">Seçin</option>
                                      <option value="true">Bəli</option>
                                      <option value="false">Xeyr</option>
                                    </select>
                                  ) : spec && spec.type === "number" ? (
                                    <input
                                      type="number"
                                      value={field.value}
                                      onChange={(e) =>
                                        handleSpecFieldChange(field.tempId, "value", e.target.value)
                                      }
                                      placeholder="Məs. 128"
                                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={field.value}
                                      onChange={(e) =>
                                        handleSpecFieldChange(field.tempId, "value", e.target.value)
                                      }
                                      placeholder="Dəyər daxil edin"
                                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                                    />
                                  )}
                                  {spec?.unit && spec.type !== "select" && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Ölçü vahidi: {typeof spec.unit === "object" ? (spec.unit.title || spec.unit.name) : spec.unit}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveSpecField(field.tempId)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
                                >
                                  <span>✓</span>
                                  Saxla
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecField(field.tempId)}
                                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
                                >
                                  <span>-</span>
                                  Sil
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {specFields.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-[#5C4977]/20 rounded-xl bg-[#5C4977]/5">
                        <FaTag className="h-12 w-12 text-[#5C4977]/40 mx-auto mb-4" />
                        <p className="text-[#5C4977]/70 text-lg font-medium mb-2">
                          Heç bir xüsusiyyət əlavə edilməyib
                        </p>
                        <p className="text-gray-500 text-sm">
                          Yuxarıdakı "+ Xüsusiyyət əlavə et" düyməsinə basaraq xüsusiyyət əlavə edin
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "features" && (!formData.category || categorySpecs.length === 0) && (
                <div className="border-b border-[#5C4977]/10 pb-6">
                  <div className="text-center py-12 bg-[#5C4977]/5 rounded-xl border-2 border-dashed border-[#5C4977]/20">
                    <FaInfoCircle className="h-12 w-12 text-[#5C4977]/40 mx-auto mb-4" />
                    <p className="text-[#5C4977]/70 text-lg font-medium">
                      Xüsusiyyətlər əlavə etmək üçün əvvəlcə kateqoriya seçməlisiniz
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      "Əsas yarat" tab-ında kateqoriya seçin
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                ) : (
                  "Məhsulu Əlavə Et"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
};

export default AddProduct;
