import React, { useState } from "react";
import {
  useCreateBlogMutation,
  useGetBlogsQuery,
} from "../../redux/api/blogApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const AddBlogs = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortContent: "",
    content: "",
    date: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const { refetch } = useGetBlogsQuery(); // Blog siyahısını yeniləmək üçün
  const navigate = useNavigate();

  // Slug generate funksiyası
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

  // Form input dəyişikliklərini state-ə ötür
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Title dəyişdikdə, əgər slug boşdursa, avtomatik generate et
      if (name === "title") {
        // Əgər slug boşdursa və ya yoxdursa, avtomatik generate et
        if (!prev.slug || prev.slug.trim() === '') {
          const autoSlug = generateSlug(value);
          return { ...prev, [name]: value, slug: autoSlug };
        }
        // Əgər slug manual dəyişdirilibsə, yalnız title-i dəyiş
        return { ...prev, [name]: value };
      }
      return { ...prev, [name]: value };
    });
  };

  // Şəkil seçimi dəyişikliklərini tut
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = Array.from(images).filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setImages(newImages);
  };

  // CoverImage seçimi dəyişikliklərini tut
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  // Form göndərmə
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Əgər slug boşdursa, title-ə əsasən avtomatik generate et
    let finalSlug = formData.slug?.trim() || '';
    if (!finalSlug && formData.title) {
      finalSlug = generateSlug(formData.title);
    }

    const form = new FormData();
    // Formdakı məlumatları FormData-ya əlavə et
    for (let key in formData) {
      if (key === "date") {
        // Date-i ISO formatına çevir
        form.append(key, new Date(formData[key]).toISOString());
      } else if (key === "slug") {
        // Slug-u finalSlug ilə əvəz et
        form.append(key, finalSlug);
      } else {
        form.append(key, formData[key]);
      }
    }
    // Seçilən şəkilləri əlavə et
    for (let i = 0; i < images.length; i++) {
      form.append("images", images[i]);
    }
    // CoverImage əlavə et
    if (coverImage) {
      form.append("coverImage", coverImage);
    }

    try {
      await createBlog(form).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Blog yazısı uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/admin-blogs");
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Xəta!",
        text: "Blog əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Yeni Bloq">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Yeni Bloq Yazısı Əlavə Et</h1>
                <p className="text-gray-600">Yeni blog yazısının məlumatlarını daxil edin</p>
              </div>
              <button
                onClick={() => navigate("/admin/admin-blogs")}
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
                      placeholder="Blog başlığı"
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
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="blog-slug-ornegi"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">Boş buraxılsa, başlıq əsasında avtomatik yaradılacaq</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Tarix *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Qısa Məzmun *
                  </label>
                  <textarea
                    name="shortContent"
                    value={formData.shortContent}
                    onChange={handleInputChange}
                    placeholder="Qısa məzmun"
                    rows="3"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Ətraflı Məzmun *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Ətraflı məzmun"
                    rows="8"
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Cover Şəkli (Bloq Detal Səhifəsi üçün)
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Cover şəkil seçin (Maksimum 5MB) - Bu şəkil blog detal səhifəsində göstəriləcək
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                  </div>
                  {coverImagePreview && (
                    <div className="mt-4 relative inline-block">
                      <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md cursor-pointer"
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Şəkillər */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6 flex items-center gap-2">
                  <FaImage className="h-5 w-5" />
                  Bloq Şəkilləri (Ana Səhifə üçün)
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5C4977] mb-3">
                    Şəkillər seçin (Maksimum 5MB hər biri) - Bu şəkillər ana səhifədə göstəriləcək
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Şəkil Previews */}
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-[#5C4977]/20 group-hover:border-[#5C4977]/40 transition-colors">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Sil"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                disabled={isCreating}
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                ) : (
                  'Bloq Yazısını Əlavə Et'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBlogs;
