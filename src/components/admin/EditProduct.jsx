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
import { useGetUnitsQuery } from '../../redux/api/unitApi';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
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
  const { data, error, isLoading, refetch: refetchProductDetails } = useGetProductDetailsQuery(id);
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const { data: brandsData } = useGetBrandsQuery();
  const brands = brandsData?.brands || [];

  const { data: specsData } = useGetSpecsQuery();
  const allSpecs = specsData?.specs || [];
  
  const { data: unitsData } = useGetUnitsQuery();
  const units = unitsData?.units || [];

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
  
  // Xüsusiyyətlər üçün repeater field state - array of { specId, name, value, unit, tempId, saved }
  const [specFields, setSpecFields] = useState([]);
  
  // Temp ID generator
  const [tempIdCounter, setTempIdCounter] = useState(0);
  
  // Seçilmiş kateqoriyanın alt kateqoriyalarını tap
  const selectedCategory = categories.find((cat) => cat.name === formData.category);
  const subcategories = selectedCategory?.subcategories || [];
  
  // Seçilmiş kateqoriyanın xüsusiyyətlərini yüklə
  const categorySpecs = selectedCategory?.specs || [];

  const [formErrors, setFormErrors] = useState({});
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Tab state
  const [activeTab, setActiveTab] = useState("basic");

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

      // Xüsusiyyətləri yüklə - specFields formatına çevir
      if (product.specs && typeof product.specs === 'object') {
        const fields = [];
        let tempId = 0;
        Object.entries(product.specs).forEach(([specName, specValues]) => {
          // Spec-i name və ya title-ə görə tap
          const spec = allSpecs.find(s => s.name === specName || s.title === specName);
          if (spec) {
            const valuesArray = Array.isArray(specValues) ? specValues : [specValues];
            
            // Select tipi üçün bütün dəyərləri bir field-də array olaraq topla
            if (spec.type === "select") {
              const selectedValueNames = valuesArray
                .map((val) => {
                  // Əvvəlcə name-ə bax, sonra value-ya, sonra isə direkt val-ın özünə
                  if (val && typeof val === 'object') {
                    return val.name !== undefined && val.name !== null ? val.name : (val.value !== undefined && val.value !== null ? val.value : null);
                  }
                  return val !== undefined && val !== null ? val : null;
                })
                .filter((name) => name !== undefined && name !== null && name !== "");
              
              if (selectedValueNames.length > 0) {
                fields.push({
                  tempId: tempId++,
                  specId: spec._id,
                  name: "", // Select tipi üçün name boşdur
                  value: selectedValueNames, // Array formatında
                  unit: "", // Select tipi üçün unit yoxdur
                  saved: true,
                });
              }
            } else {
              // Digər tiplər üçün hər bir dəyər ayrı field
              valuesArray.forEach((val) => {
                fields.push({
                  tempId: tempId++,
                  specId: spec._id,
                  name: val.name !== undefined ? val.name : (val.value !== undefined ? val.value : val),
                  value: val.value !== undefined ? val.value : val,
                  unit: val.unit || (spec.unit ? (spec.unit._id || spec.unit) : ""),
                  saved: true,
                });
              });
            }
          }
        });
        setSpecFields(fields);
        setTempIdCounter(tempId);
      }
    }

    if (data?.product && data.product.images && data.product.images.length > 0) {
      setPreviews(data.product.images.map(img => img.url));
      setMainImageIndex(0);
    }
  }, [data, allSpecs]);

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
      saved: false,
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
          const updated = { ...item, [field]: value, saved: false };
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
    setFormData(prev => {
      // Əgər kateqoriya dəyişirsə, alt kateqoriyanı sıfırla
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
                // Select tipi üçün unit yoxdur (spec.name və spec.title istifadə olunur)
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
        updatedData.append("specs", JSON.stringify(specsToSend));
        }
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
      });
      
      // Məhsul məlumatlarını yenilə (olduğu sayfada qalır)
      refetchProductDetails();

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
                    Slug (URL üçün) <span className="text-gray-500 text-xs font-normal">(Avtomatik yaradılır)</span>
                  </label>
                  <input
                    name="slug"
                    value={formData.slug}
                    placeholder="Məs. iphone-15-pro-max"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl bg-gray-50 cursor-not-allowed transition-colors"
                    readOnly
                    disabled={isUpdating}
                  />
                  <p className="text-xs text-gray-500 mt-1">Slug məhsul adı dəyişdikdə avtomatik yenilənir</p>
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

            {/* Şəkillər - Basic Tab */}
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
              </>
            )}

            {/* Xüsusiyyətlər - Features Tab */}
            {activeTab === "features" && formData.category && categorySpecs.length > 0 && (
              <div className="border-b border-[#5C4977]/10 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#5C4977] flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Xüsusiyyətlər
                  </h2>
              <button
                type="button"
                    onClick={handleAddSpecField}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#5C4977] text-white rounded-xl hover:bg-[#5C4977]/90 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50"
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
                              <div className={spec && spec.type === "select" ? "md:col-span-4" : "md:col-span-4"}>
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
                                  disabled={isUpdating}
                                  className="flex-1 px-3 py-2 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-all duration-200 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Düzəliş"
                                >
                                  <span className="text-sm">✎</span>
                                  <span>Düzəliş</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecField(field.tempId)}
                                  disabled={isUpdating}
                                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Sil"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Sil</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Yeni/redaktə rejimi
                          <div className="space-y-4">
                            <div className={`grid grid-cols-1 ${spec && spec.type === "select" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
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
                                  disabled={isUpdating}
                                  className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors disabled:opacity-50"
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
                                    disabled={isUpdating}
                                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors disabled:opacity-50"
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
                                                  disabled={isUpdating}
                                                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#5C4977] focus:ring-[#5C4977] cursor-pointer disabled:opacity-50"
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
                                    disabled={isUpdating}
                                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors disabled:opacity-50"
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
                                    disabled={isUpdating}
                                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors disabled:opacity-50"
                                  />
                                ) : (
                      <input
                                    type="text"
                                    value={field.value}
                        onChange={(e) =>
                                      handleSpecFieldChange(field.tempId, "value", e.target.value)
                                    }
                                    placeholder="Dəyər daxil edin"
                                    disabled={isUpdating}
                                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors disabled:opacity-50"
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
                  disabled={isUpdating}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                                <span>✓</span>
                                Saxla
                </button>
                <button
                  type="button"
                                onClick={() => handleRemoveSpecField(field.tempId)}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50"
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
                      <Tag className="h-12 w-12 text-[#5C4977]/40 mx-auto mb-4" />
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
                  <Info className="h-12 w-12 text-[#5C4977]/40 mx-auto mb-4" />
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