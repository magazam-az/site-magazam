import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBlogDetailsQuery, useUpdateBlogMutation } from "../../redux/api/blogApi";
import Swal from "sweetalert2";
import { FaImage } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetBlogDetailsQuery(id);
  const [updateBlog] = useUpdateBlogMutation();

  const [formData, setFormData] = useState({
    title: "",
    shortContent: "",
    content: "",
    date: "",
  });

  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

  useEffect(() => {
    if (data?.blog) {
      const blog = data.blog;
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        shortContent: blog.shortContent || "",
        content: blog.content || "",
        date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : "",
      });
      setImagePreviews(blog.images || []);
      setNewImages([]);
      setRemovedImages([]);
      setCoverImagePreview(blog.coverImage?.url || null);
      setCoverImage(null);
      setRemoveCoverImage(false);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [
          ...prev,
          { url: reader.result, isNew: true, file },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index, imageId) => {
    if (imageId && !imagePreviews[index]?.isNew) {
      setRemovedImages((prev) => [...prev, imageId]);
    }
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    if (imagePreviews[index]?.isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // CoverImage seçimi dəyişikliklərini tut
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setRemoveCoverImage(false);
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
    setRemoveCoverImage(true);
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
        if (key === "date") {
          updatedData.append(key, new Date(value).toISOString());
        } else if (value) {
          updatedData.append(key, value);
        }
      });

      newImages.forEach((image) => {
        updatedData.append("images", image);
      });

      removedImages.forEach((imageId) => {
        updatedData.append("removedImages", imageId);
      });

      // CoverImage əlavə et
      if (coverImage) {
        updatedData.append("coverImage", coverImage);
      }

      // CoverImage silinməsi
      if (removeCoverImage) {
        updatedData.append("removeCoverImage", "true");
      }

      await updateBlog({ id, blogData: updatedData }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Blog yazısı uğurla yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/admin-blogs");
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Blog yazısı yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Bloq Yazısını Redaktə Et">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Bloq Yazısını Redaktə Et">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Bloq Yazısını Redaktə Et</h1>
                <p className="text-gray-600">Blog yazısının məlumatlarını yeniləyin</p>
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
                      placeholder="Blog başlığı"
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
                      placeholder="blog-slug-ornegi"
                      className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">URL üçün unikal slug (məs: blog-bashligi)</p>
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
                    Yeni şəkillər əlavə edin (Maksimum 5MB hər biri) - Bu şəkillər ana səhifədə göstəriləcək
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewImagesChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Şəkil Previews */}
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {imagePreviews.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-[#5C4977]/20 group-hover:border-[#5C4977]/40 transition-colors">
                          <img
                            src={img.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, img.public_id || img.id)}
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
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#5C4977]/20"
              >
                <div className="flex items-center justify-center gap-2">
                  Yadda Saxla
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBlog;



