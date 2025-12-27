import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useEditProductMutation, 
  useGetProductsQuery 
} from '../../redux/api/productsApi';
import { useGetCategoriesQuery } from '../../redux/api/categoryApi';
import { useGetBrandsQuery } from '../../redux/api/brandApi';
import { useGetSpecsQuery } from '../../redux/api/specApi';
import Swal from 'sweetalert2';
import { 
  Upload, 
  X, 
  Star, 
  Package, 
  Tag, 
  DollarSign, 
  FileText, 
  Layers, 
  Cpu,
  Image as ImageIcon,
  Save,
  Check,
  ArrowLeft,
  Info,
  Loader2
} from 'lucide-react';
import AdminLayout from './AdminLayout';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const { refetch } = useGetProductsQuery();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const { data: brandsData } = useGetBrandsQuery();
  const brands = brandsData?.brands || [];

  const { data: specsData } = useGetSpecsQuery();
  const specs = specsData?.specs || [];

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    slug: '',
    price: '',
    description: '',
    category: '',
    subcategory: '',
    stock: '',
    keywords: [], // ✅ ARRAY
    attributes: [], // ✅ Attributes array
  });

  // ✅ keyword input (tag əlavə etmək üçün)
  const [keywordInput, setKeywordInput] = useState("");
  
  // Seçilmiş xüsusiyyətlər
  const [selectedSpecs, setSelectedSpecs] = useState({});
  
  // Seçilmiş kateqoriyanın alt kateqoriyalarını tap
  const selectedCategory = categories.find((cat) => cat.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  const [formErrors, setFormErrors] = useState({});
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (data?.product) {
      const product = data.product;
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        model: product.model || '',
        slug: product.slug || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        stock: product.stock || '',
        keywords: product.keywords && Array.isArray(product.keywords) 
          ? [...product.keywords] 
          : [],
        attributes: product.attributes && Array.isArray(product.attributes)
          ? [...product.attributes]
          : [],
      });

      // Xüsusiyyətləri yüklə
      if (product.specs && typeof product.specs === 'object') {
        // Product specs-də spec name və value var
        // Bizim selectedSpecs-də specId -> specName saxlamalıyıq
        const selectedSpecsMap = {};
        Object.entries(product.specs).forEach(([specName, specValue]) => {
          // Specs array-dən spec name-ə uyğun gələn spec-i tap
          const spec = specs.find(s => s.name === specName);
          if (spec) {
            selectedSpecsMap[spec._id] = spec.name;
          }
        });
        setSelectedSpecs(selectedSpecsMap);
      }
    }

    if (data?.product && data.product.images && data.product.images.length > 0) {
      setPreviews(data.product.images.map(img => img.url));
      setMainImageIndex(0);
    }
  }, [data, specs]);

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

  // Xüsusiyyət seçimi üçün funksiya
  const handleSpecChange = (specId, specName) => {
    setSelectedSpecs(prev => {
      // Əgər spec artıq seçilibsə, sil
      if (prev[specId]) {
        const newSpecs = { ...prev };
        delete newSpecs[specId];
        return newSpecs;
      }
      // Əgər spec seçilməyibsə, əlavə et
      return { ...prev, [specId]: specName };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Əgər kateqoriya dəyişirsə, alt kateqoriyanı sıfırla
      if (name === "category") {
        return { ...prev, [name]: value, subcategory: "" };
      }
      // Auto-generate slug from name if slug is empty and name is being changed
      if (name === "name" && !prev.slug) {
        const autoSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { ...prev, [name]: value, slug: autoSlug };
      }
      return { ...prev, [name]: value };
    });
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Ad tələb olunur';
        break;
      case 'brand':
        if (!value.trim()) errors.brand = 'Brend tələb olunur';
        break;
      case 'model':
        if (!value.trim()) errors.model = 'Model tələb olunur';
        break;
      case 'price':
        if (!value) errors.price = 'Qiymət tələb olunur';
        else if (isNaN(value) || Number(value) <= 0) errors.price = 'Qiymət düzgün formatda olmalıdır';
        break;
      case 'stock':
        if (!value) errors.stock = 'Stok tələb olunur';
        else if (isNaN(value) || Number(value) < 0) errors.stock = 'Stok miqdarı düzgün formatda olmalıdır';
        break;
      case 'description':
        if (!value.trim()) errors.description = 'Açıqlama tələb olunur';
        break;
      case 'category':
        if (!value.trim()) errors.category = 'Kateqoriya tələb olunur';
        break;
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    const totalImages = previews.length - removedImages.length + files.length;
    if (totalImages > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil ola bilər",
        icon: "warning",
        background: '#f8f7fa',
        color: '#5C4977',
        confirmButtonColor: '#5C4977'
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning",
          background: '#f8f7fa',
          color: '#5C4977',
          confirmButtonColor: '#5C4977'
        });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index, isExistingImage = false, imageId = null) => {
    const previewToRemove = previews[index];
    
    if (!previewToRemove) return;
    
    // Blob URL-i təmizlə
    if (previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
    }
    
    // Preview-dan sil
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    // Əgər mövcud şəkilidirsə, removedImages-ə əlavə et
    if (isExistingImage && imageId) {
      setRemovedImages(prev => [...prev, imageId]);
    } else {
      // Yeni əlavə edilən şəkilləri sil
      // Mövcud şəkillərin sayını hesabla
      const existingImagesCount = (data?.product?.images?.length || 0) - removedImages.length;
      // Yeni şəkil index-i = index - existingImagesCount
      const newImageIndex = index - existingImagesCount;
      
      if (newImageIndex >= 0 && newImageIndex < images.length) {
        const newImages = images.filter((_, i) => i !== newImageIndex);
        setImages(newImages);
      }
    }

    // Main image index-i yenilə
    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      name: "Ad", brand: "Brend", model: "Model", price: "Qiymət",
      description: "Açıqlama", category: "Kateqoriya", stock: "Stok"
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        errors[field] = `${fieldName} tələb olunur`;
      }
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Qiymət düzgün formatda olmalıdır";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = "Stok miqdarı düzgün formatda olmalıdır";
    }

    // Əgər kateqoriya seçilibsə və alt kateqoriyalar varsa, alt kateqoriya tələb olunur
    if (formData.category && subcategories.length > 0 && !formData.subcategory) {
      errors.subcategory = "Alt kateqoriya seçilməlidir";
    }

    const remainingImages = previews.length - removedImages.length;
    if (remainingImages === 0 && images.length === 0) {
      Swal.fire({ 
        title: "Xəta", 
        text: "Ən azı bir şəkil olmalıdır", 
        icon: "error",
        background: '#f8f7fa',
        color: '#5C4977',
        confirmButtonColor: '#5C4977'
      });
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedData = new FormData();
      
      // ✅ normal field-lər
      Object.entries(formData).forEach(([key, value]) => {
        // keywords və attributes array-ləri burda append ETMİRİK (aşağıda ayrıca edəcəyik)
        if (key === "keywords" || key === "attributes") return;

        if (key === "subcategory") {
          if (value && value.toString().trim() !== "") {
            updatedData.append(key, value.toString().trim());
          }
          return;
        }

        if (value !== undefined && value !== null && value !== '') {
          updatedData.append(key, value.toString());
        }
      });

      // ✅ keywords array kimi göndər (FormData-da eyni key bir neçə dəfə -> backenddə array olur)
      if (Array.isArray(formData.keywords) && formData.keywords.length > 0) {
        formData.keywords.forEach((kw) => {
          if (kw && kw.toString().trim() !== "") {
            updatedData.append("keywords", kw.toString().trim());
          }
        });
      }

      // ✅ Attributes array kimi göndər (JSON string kimi)
      // Attributes-lər artıq ayrı səhifədə idarə olunur (ProductAttributes)
      if (Array.isArray(formData.attributes) && formData.attributes.length > 0) {
        updatedData.append("attributes", JSON.stringify(formData.attributes));
      }

      updatedData.append("mainImageIndex", mainImageIndex.toString());

      // Seçilmiş xüsusiyyətləri əlavə et
      if (Object.keys(selectedSpecs).length > 0) {
        updatedData.append("specs", JSON.stringify(selectedSpecs));
      }

      images.forEach((file) => {
        updatedData.append("images", file);
      });

      removedImages.forEach((imageId) => {
        updatedData.append("removedImages", imageId);
      });

      const result = await editProduct({ 
        id, 
        formData: updatedData 
      }).unwrap();

      previews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      Swal.fire({
        title: "Uğurlu!",
        text: "Məhsul uğurla yeniləndi!",
        icon: "success",
        background: '#f8f7fa',
        color: '#5C4977',
        confirmButtonColor: '#5C4977',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/admin/products");
        refetch();
      });

    } catch (err) {
      console.error("Xəta detalları:", err);
      
      let errorMessage = "Məhsul yenilənmədi!";
      
      if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 'FETCH_ERROR') {
        errorMessage = "Serverlə əlaqə problemi. Zəhmət olmasa bir daha yoxlayın.";
      } else if (err?.status === 500) {
        if (err?.data?.message?.includes('Unexpected field')) {
          errorMessage = "Server konfiqurasiya xətası: Şəkil field adı uyğun gəlmir.";
        } else {
          errorMessage = "Server xətası. Şəkil fayllarının ölçüsünü yoxlayın.";
        }
      }
      
      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
        background: '#f8f7fa',
        color: '#5C4977',
        confirmButtonColor: '#5C4977'
      });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] to-[#f0edf5] pt-24 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full">
        <div className="text-red-500 text-center">
          <X className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[#5C4977]">Xəta baş verdi</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
              onClick={() => navigate("/admin/products")}
            className="mt-4 w-full bg-[#5C4977] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 transition-colors cursor-pointer"
          >
            Admin məhsullarına qayıt
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout pageTitle="Məhsulu Redaktə Et">
    <div className="bg-gray-50 min-h-full p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Məhsulu Redaktə Et</h1>
              <p className="text-gray-600">"{formData.name}" məhsulunun məlumatlarını yeniləyin</p>
            </div>
            <button
              onClick={() => navigate("/admin/products")}
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
                <Info className="h-5 w-5" />
                Əsas Məlumatlar
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Məhsul Adı *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    placeholder="Məhsul adını daxil edin"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    disabled={isUpdating}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Brand - SELECT olaraq */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Brend *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('brand', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.brand 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    disabled={isUpdating}
                  >
                    <option value="">Brend seçin</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.brand && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Model *
                  </label>
                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('model', e.target.value)}
                    placeholder="Model adını daxil edin"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.model 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    disabled={isUpdating}
                  />
                  {formErrors.model && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Slug (URL üçün) <span className="text-gray-500 text-xs font-normal">(İstəyə bağlı)</span>
                  </label>
                  <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Məs. iphone-15-pro-max"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    disabled={isUpdating}
                  />
                  <p className="text-xs text-gray-500 mt-1">Boş buraxılsa, məhsul adı əsasında avtomatik yaradılacaq</p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Qiymət (AZN) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('price', e.target.value)}
                    placeholder="Qiyməti daxil edin"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.price 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    step="0.01"
                    min="0"
                    disabled={isUpdating}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Stok Miqdarı *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('stock', e.target.value)}
                    placeholder="Stok miqdarını daxil edin"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.stock 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    min="0"
                    disabled={isUpdating}
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Kateqoriya *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('category', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                      formErrors.category 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                    }`}
                    disabled={isUpdating}
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                {/* Subcategory */}
                {formData.category && subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Alt Kateqoriya *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      onBlur={(e) => validateField('subcategory', e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                        formErrors.subcategory 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                      }`}
                      disabled={isUpdating}
                    >
                      <option value="">Alt kateqoriya seçin</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.subcategory && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.subcategory}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Açıqlama */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Açıqlama
              </h2>
              <div>
                <label className="block text-sm font-medium text-[#5C4977] mb-2">
                  Məhsul Haqqında *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('description', e.target.value)}
                  placeholder="Məhsul haqqında ətraflı məlumat yazın..."
                  rows="4"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors ${
                    formErrors.description 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-[#5C4977]/20 hover:border-[#5C4977]/40'
                  }`}
                  disabled={isUpdating}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* ✅ Açar Sözlər (TAG + / ×) */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5" />
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
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  disabled={isUpdating}
                  className="px-5 rounded-xl border border-[#5C4977] text-[#5C4977] hover:bg-[#5C4977]/5 transition-colors cursor-pointer disabled:opacity-50"
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
                        disabled={isUpdating}
                        className="hover:text-red-200 cursor-pointer disabled:opacity-50"
                        title="Sil"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Texniki Xüsusiyyətlər */}
            <div className="border-b border-[#5C4977]/10 pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Xüsusiyyətlər (Seçmək üçün klikləyin)
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {specs.map((spec) => (
                    <button
                      key={spec._id}
                      type="button"
                      onClick={() => handleSpecChange(spec._id, spec.name)}
                      className={`p-3 border rounded-xl text-left transition-all duration-200 cursor-pointer ${
                        selectedSpecs[spec._id]
                          ? 'bg-[#5C4977] text-white border-[#5C4977]'
                          : 'border-[#5C4977]/20 hover:border-[#5C4977] hover:bg-[#5C4977]/5'
                      }`}
                      disabled={isUpdating}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{spec.name}</span>
                        {selectedSpecs[spec._id] && (
                          <Check className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {specs.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Xüsusiyyət yoxdur. Admin panelindən xüsusiyyət əlavə edin.
                  </p>
                )}
                {Object.keys(selectedSpecs).length > 0 && (
                  <div className="mt-4 p-4 bg-[#5C4977]/5 rounded-xl">
                    <p className="text-sm font-medium text-[#5C4977] mb-2">
                      Seçilmiş Xüsusiyyətlər:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSpecs).map(([specId, specName]) => (
                        <span
                          key={specId}
                          className="inline-flex items-center gap-1 bg-[#5C4977] text-white px-3 py-1 rounded-full text-sm"
                        >
                          {specName}
                          <button
                            type="button"
                            onClick={() => handleSpecChange(specId, specName)}
                            className="ml-1 hover:text-red-200 cursor-pointer"
                            disabled={isUpdating}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Şəkillər */}
            <div className="pb-6">
              <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Məhsul Şəkilləri
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#5C4977] mb-3">
                  Yeni şəkillər əlavə edin (Maksimum 6 şəkil)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={previews.length - removedImages.length + images.length >= 6 || isUpdating}
                    className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 disabled:opacity-50 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Upload className="h-5 w-5 text-[#5C4977]/60" />
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
                        <Star className="h-3 w-3" />
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
                  previews.map((preview, index) => {
                    // Mövcud şəkilləri yoxla
                    const existingImage = data?.product?.images?.find(img => img.url === preview);
                    const isExistingImage = !!existingImage;
                    const isRemoved = isExistingImage && removedImages.includes(existingImage?.public_id);

                    if (isRemoved) return null;

                    return (
                      <div key={index} className="relative group">
                        <div className={`aspect-square overflow-hidden rounded-lg border-2 ${
                          index === mainImageIndex ? 'border-green-500' : 'border-[#5C4977]/20'
                        } group-hover:border-[#5C4977]/40 transition-colors`}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/300x300/6B7280/ffffff?text=Image+Error";
                            }}
                          />
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
                              disabled={isUpdating}
                            >
                              <Star className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index, isExistingImage, existingImage?.public_id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                            title="Sil"
                            disabled={isUpdating}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#5C4977]/20 rounded-xl bg-[#5C4977]/5">
                    <ImageIcon className="h-12 w-12 text-[#5C4977]/40 mb-4" />
                    <p className="text-[#5C4977]/70 text-center">
                      Heç bir şəkil əlavə edilməyib
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  {previews.length - removedImages.length + images.length}/6 şəkil • Maksimum ölçü: 5MB
                </p>
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  disabled={previews.length - removedImages.length + images.length >= 6 || isUpdating}
                  className="text-sm text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Upload className="inline mr-1 h-4 w-4" />
                  Şəkil əlavə et
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
            >
              {isUpdating ? (
                <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" />
                  Məhsulu Yenilə
                </div>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
    </AdminLayout>
  );
};

export default EditProduct;