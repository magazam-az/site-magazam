import React, { useState } from "react";
import { useAddProductMutation } from "../../redux/api/productsApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    seller: "",
  });

  const [specsInput, setSpecsInput] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0); // Əsas şəkil indeksi

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const categories = [
    "Phone", "Laptop", "Tablet", "TV", "Headphones", 
    "Smartwatch", "Console", "Camera", "Accessory"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Maksimum 6 şəkil limiti
    if (images.length + files.length > 6) {
      Swal.fire({
        title: "Xəta!",
        text: "Maksimum 6 şəkil əlavə edə bilərsiniz",
        icon: "warning"
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Xəta!",
          text: `${file.name} faylının ölçüsü çox böyükdür (maksimum 5MB)`,
          icon: "warning"
        });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Yeni şəkillər üçün preview yarat
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const addSpecField = () => {
    setSpecsInput((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecField = (idx) => {
    setSpecsInput((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleSpecChange = (e, idx) => {
    const { name, value } = e.target;
    setSpecsInput((prev) => {
      const updated = [...prev];
      updated[idx][name] = value;
      return updated;
    });
  };

  const removeImage = (index) => {
    // Preview URL-ni təmizlə
    if (previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }
    
    // Şəkilləri və preview-ləri yenilə
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);

    // Əsas şəkil silinirsə, birinci şəkili əsas et
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
    const requiredFields = {
      name: "Ad", brand: "Brend", model: "Model", price: "Qiymət",
      description: "Açıqlama", category: "Kateqoriya", stock: "Stok", seller: "Satıcı"
    };

    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `${fieldName} sahəsi tələb olunur`;
      }
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
      Swal.fire({ title: "Xəta", text: validationError, icon: "error" });
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      // Əsas şəkil indeksini əlavə et
      formDataToSend.append("mainImageIndex", mainImageIndex.toString());

      const specsObj = {};
      let hasValidSpecs = false;
      
      specsInput.forEach((item) => {
        if (item.key && item.value && item.key.trim() !== "" && item.value.trim() !== "") {
          specsObj[item.key.trim()] = item.value.trim();
          hasValidSpecs = true;
        }
      });
      
      if (hasValidSpecs) {
        console.log("🔄 Specs əlavə edilir:", specsObj);
        formDataToSend.append("specs", JSON.stringify(specsObj));
      }

      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      console.log("=== GÖNDƏRİLƏN FORMDATA ===");
      console.log("Əsas şəkil indeksi:", mainImageIndex);
      for (let [key, value] of formDataToSend.entries()) {
        if (key === "images") {
          console.log(`${key}:`, value.name, `(${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log("=========================");

      const result = await addProduct(formDataToSend).unwrap();
      console.log("✅ Uğurlu cavab:", result);
      
      previews.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      setFormData({
        name: "", brand: "", model: "", price: "", description: "",
        category: "", stock: "", seller: "",
      });
      setSpecsInput([{ key: "", value: "" }]);
      setImages([]);
      setPreviews([]);
      setMainImageIndex(0);
      
      Swal.fire({ 
        title: "Uğur!", 
        text: "Məhsul uğurla əlavə edildi", 
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/admin/adminproducts");
      });
      
    } catch (error) {
      console.error("❌ Xəta baş verdi:", error);
      
      let errorMessage = "Məhsul əlavə edilərkən xəta baş verdi";
      
      if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 'FETCH_ERROR') {
        errorMessage = "Serverlə əlaqə problemi. Zəhmət olmasa bir daha yoxlayın.";
      } else if (error?.status === 500) {
        errorMessage = "Server xətası. Məlumatların düzgünlüyünü yoxlayın.";
      }
      
      Swal.fire({
        title: "Xəta!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Başa düşdüm"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Məhsul Əlavə Et</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Məhsul Adı *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Məhsul adını daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brend *</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brend adını daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Model adını daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət *</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Qiyməti daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stok miqdarını daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satıcı *</label>
            <input
              name="seller"
              value={formData.seller}
              onChange={handleInputChange}
              placeholder="Satıcı məlumatını daxil edin"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kateqoriya *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Kateqoriya seçin</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıqlama *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Məhsul haqqında ətraflı məlumat"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Texniki Xüsusiyyətlər (İstəyə bağlı)</h3>
          
          {specsInput.map((spec, index) => (
            <div key={index} className="flex gap-3 mb-3 items-end">
              <div className="flex-1">
                <input
                  name="key"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(e, index)}
                  placeholder="Xüsusiyyət (məs: RAM)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex-1">
                <input
                  name="value"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(e, index)}
                  placeholder="Dəyər (məs: 16GB)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {specsInput.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecField(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSpecField}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Yeni Xüsusiyyət
          </button>
        </div>

        {/* Şəkillər */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Məhsul Şəkilləri * (Maksimum 6 şəkil)
          </label>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={images.length >= 6}
            className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Əsas Şəkil (Ön şəkil)</h4>
            {previews.length > 0 && (
              <div className="mb-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <img
                    src={previews[mainImageIndex]}
                    alt="Əsas şəkil"
                    className="w-32 h-32 object-cover border-2 border-green-500 rounded-lg shadow-md"
                  />
                  <div>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                      Əsas Şəkil
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Bu şəkil məhsulun ön şəkili kimi göstəriləcək
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {previews.length > 0 ? (
              previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className={`w-24 h-24 object-cover border rounded-md shadow-sm ${
                      index === mainImageIndex ? 'border-2 border-green-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                    {index !== mainImageIndex && (
                      <button
                        type="button"
                        onClick={() => setAsMainImage(index)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        title="Əsas şəkil et"
                      >
                        ★
                      </button>
                    )}
                  </div>
                  {index === mainImageIndex && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
                      Əsas
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                <span>Şəkil yoxdur</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Ən azı bir şəkil əlavə edilməlidir. Maksimum 6 şəkil. Maksimum şəkil ölçüsü: 5MB.
            {previews.length > 0 && " ★ ilə əsas şəkili seçə bilərsiniz."}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Əlavə edilir...
            </>
          ) : (
            "Məhsulu Əlavə Et"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;