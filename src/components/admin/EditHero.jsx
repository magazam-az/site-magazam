import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHeroByIdQuery, useUpdateHeroMutation } from "../../redux/api/heroApi";
import Swal from "sweetalert2";
import { FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditHero = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetHeroByIdQuery(id);
  const [updateHero] = useUpdateHeroMutation();

  const [heroType, setHeroType] = useState("DefaultSlider");
  const [slides, setSlides] = useState([]);
  const [rightTop, setRightTop] = useState({
    image: null,
    imagePreview: null,
    title: "",
    buttonText: "",
    buttonLink: "",
    endDate: "",
  });
  const [bottomBlocks, setBottomBlocks] = useState([]);

  useEffect(() => {
    if (data?.hero) {
      const hero = data.hero;
      setHeroType(hero.type || "DefaultSlider");

      // Slides
      if (hero.leftSide?.slides && hero.leftSide.slides.length > 0) {
        setSlides(
          hero.leftSide.slides.map((slide) => ({
            image: null,
            imagePreview: slide.image?.url || null,
            existingImage: slide.image,
            title: slide.title || "",
            description: slide.description || "",
            buttonText: slide.buttonText || "",
            buttonLink: slide.buttonLink || "",
          }))
        );
      } else {
        setSlides([
          { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
        ]);
      }

      // RightTop
      if (hero.rightTop) {
        setRightTop({
          image: null,
          imagePreview: hero.rightTop.image?.url || null,
          existingImage: hero.rightTop.image,
          title: hero.rightTop.title || "",
          buttonText: hero.rightTop.buttonText || "",
          buttonLink: hero.rightTop.buttonLink || "",
          endDate: hero.rightTop.endDate
            ? new Date(hero.rightTop.endDate).toISOString().slice(0, 16)
            : "",
        });
      }

      // BottomBlocks
      if (hero.bottomBlocks && hero.bottomBlocks.length > 0) {
        setBottomBlocks(
          hero.bottomBlocks.map((block) => ({
            image: null,
            imagePreview: block.image?.url || null,
            existingImage: block.image,
            title: block.title || "",
            description: block.description || "",
            buttonText: block.buttonText || "",
            buttonLink: block.buttonLink || "",
          }))
        );
      } else {
        setBottomBlocks([
          { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" },
          { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
        ]);
      }
    }
  }, [data]);

  // Slide işləmələri
  const addSlide = () => {
    setSlides([...slides, { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }]);
  };

  const removeSlide = (index) => {
    if (slides.length > 1) {
      setSlides(slides.filter((_, i) => i !== index));
    }
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSlideImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSlides = [...slides];
      newSlides[index].image = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newSlides[index].imagePreview = reader.result;
        setSlides(newSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  // RightTop işləmələri
  const updateRightTop = (field, value) => {
    setRightTop({ ...rightTop, [field]: value });
  };

  const handleRightTopImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRightTop({ ...rightTop, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setRightTop({ ...rightTop, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // BottomBlocks işləmələri
  const updateBottomBlock = (index, field, value) => {
    const newBlocks = [...bottomBlocks];
    newBlocks[index][field] = value;
    setBottomBlocks(newBlocks);
  };

  const handleBottomBlockImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newBlocks = [...bottomBlocks];
      newBlocks[index].image = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newBlocks[index].imagePreview = reader.result;
        setBottomBlocks(newBlocks);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form göndərmə
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (slides.length === 0) {
      Swal.fire({
        title: "Xəta!",
        text: "Ən azı bir slide əlavə edin",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide.title || !slide.description || !slide.buttonText || !slide.buttonLink) {
        Swal.fire({
          title: "Xəta!",
          text: `Slide ${i + 1} üçün bütün sahələr doldurulmalıdır`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
      // Şəkil yoxlanışı - ya yeni şəkil ya da mövcud şəkil olmalıdır
      if (!slide.image && !slide.existingImage) {
        Swal.fire({
          title: "Xəta!",
          text: `Slide ${i + 1} üçün şəkil tələb olunur`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    if (!rightTop.title || !rightTop.buttonText || !rightTop.buttonLink || !rightTop.endDate) {
      Swal.fire({
        title: "Xəta!",
        text: "Sağ üst hissə üçün bütün sahələr doldurulmalıdır",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }
    if (!rightTop.image && !rightTop.existingImage) {
      Swal.fire({
        title: "Xəta!",
        text: "Sağ üst hissə üçün şəkil tələb olunur",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    for (let i = 0; i < bottomBlocks.length; i++) {
      const block = bottomBlocks[i];
      if (!block.title || !block.description || !block.buttonText || !block.buttonLink) {
        Swal.fire({
          title: "Xəta!",
          text: `Alt blok ${i + 1} üçün bütün sahələr doldurulmalıdır`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
      if (!block.image && !block.existingImage) {
        Swal.fire({
          title: "Xəta!",
          text: `Alt blok ${i + 1} üçün şəkil tələb olunur`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    const form = new FormData();
    form.append("type", heroType);

    // Slide şəkilləri
    slides.forEach((slide, index) => {
      if (slide.image) {
        form.append(`slideImage_${index}`, slide.image);
      }
    });

    // RightTop şəkli
    if (rightTop.image) {
      form.append("rightTopImage", rightTop.image);
    }

    // BottomBlocks şəkilləri
    bottomBlocks.forEach((block, index) => {
      if (block.image) {
        form.append(`bottomBlockImage_${index}`, block.image);
      }
    });

    // JSON məlumatları
    const leftSideData = {
      slides: slides.map(slide => ({
        title: slide.title,
        description: slide.description,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        image: slide.existingImage || null, // Mövcud şəkil varsa göndər
      }))
    };
    form.append("leftSide", JSON.stringify(leftSideData));

    const rightTopData = {
      title: rightTop.title,
      buttonText: rightTop.buttonText,
      buttonLink: rightTop.buttonLink,
      endDate: new Date(rightTop.endDate).toISOString(),
      image: rightTop.existingImage || null, // Mövcud şəkil varsa göndər
    };
    form.append("rightTop", JSON.stringify(rightTopData));

    const bottomBlocksData = bottomBlocks.map(block => ({
      title: block.title,
      description: block.description,
      buttonText: block.buttonText,
      buttonLink: block.buttonLink,
      image: block.existingImage || null, // Mövcud şəkil varsa göndər
    }));
    form.append("bottomBlocks", JSON.stringify(bottomBlocksData));

    try {
      await updateHero({ id, heroData: form }).unwrap();

      Swal.fire({
        title: "Uğur!",
        text: "Hero uğurla yeniləndi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      navigate("/admin/heroes");
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Hero yenilənərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Hero Redaktəsi">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Hero Redaktəsi">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">Hero Redaktə Et</h1>
                <p className="text-gray-600">Hero məlumatlarını yeniləyin</p>
              </div>
              <button
                onClick={() => navigate("/admin/heroes")}
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
              {/* Hero Type */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6">Hero Tipi</h2>
                <div>
                  <label className="block text-sm font-medium text-[#5C4977] mb-2">
                    Tip *
                  </label>
                  <select
                    value={heroType}
                    onChange={(e) => setHeroType(e.target.value)}
                    className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                    required
                  >
                    <option value="DefaultSlider">DefaultSlider</option>
                  </select>
                </div>
              </div>

              {/* Sol Tərəf - Slider */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#5C4977]">Sol Tərəf - Slider</h2>
                  <button
                    type="button"
                    onClick={addSlide}
                    className="bg-[#5C4977] text-white px-4 py-2 rounded-lg hover:bg-[#5C4977]/90 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FaPlus className="h-4 w-4" />
                    Slide Əlavə Et
                  </button>
                </div>

                {slides.map((slide, index) => (
                  <div key={index} className="mb-6 p-6 border border-[#5C4977]/20 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#5C4977]">Slide {index + 1}</h3>
                      {slides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlide(index)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#5C4977] mb-2">
                          Şəkil {slide.existingImage ? "(Mövcud şəkil var, yenisini seçmək istəsəniz)" : "*"}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlideImageChange(index, e)}
                          className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                        />
                        {slide.imagePreview && (
                          <div className="mt-4 relative inline-block">
                            <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                              <img
                                src={slide.imagePreview}
                                alt={`Slide ${index + 1} preview`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#5C4977] mb-2">
                            Başlıq *
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(index, "title", e.target.value)}
                            placeholder="Slide başlığı"
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#5C4977] mb-2">
                            Yazı *
                          </label>
                          <textarea
                            value={slide.description}
                            onChange={(e) => updateSlide(index, "description", e.target.value)}
                            placeholder="Slide yazısı"
                            rows="3"
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Button Yazısı *
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText}
                              onChange={(e) => updateSlide(index, "buttonText", e.target.value)}
                              placeholder="Shop Now"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Button Linki *
                            </label>
                            <input
                              type="text"
                              value={slide.buttonLink}
                              onChange={(e) => updateSlide(index, "buttonLink", e.target.value)}
                              placeholder="/catalog"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sağ Tərəf - Üst Hissə */}
              <div className="border-b border-[#5C4977]/10 pb-6">
                <h2 className="text-xl font-bold text-[#5C4977] mb-6">Sağ Tərəf - Üst Hissə</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#5C4977] mb-2">
                      Şəkil {rightTop.existingImage ? "(Mövcud şəkil var, yenisini seçmək istəsəniz)" : "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleRightTopImageChange}
                      className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                    />
                    {rightTop.imagePreview && (
                      <div className="mt-4 relative inline-block">
                        <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                          <img
                            src={rightTop.imagePreview}
                            alt="Right top preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">
                        Başlıq *
                      </label>
                      <input
                        type="text"
                        value={rightTop.title}
                        onChange={(e) => updateRightTop("title", e.target.value)}
                        placeholder="Başlıq"
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">
                        Button Yazısı *
                      </label>
                      <input
                        type="text"
                        value={rightTop.buttonText}
                        onChange={(e) => updateRightTop("buttonText", e.target.value)}
                        placeholder="Buy Now"
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">
                        Button Linki *
                      </label>
                      <input
                        type="text"
                        value={rightTop.buttonLink}
                        onChange={(e) => updateRightTop("buttonLink", e.target.value)}
                        placeholder="/product/123"
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4977] mb-2">
                        Bitmə Tarixi *
                      </label>
                      <input
                        type="datetime-local"
                        value={rightTop.endDate}
                        onChange={(e) => updateRightTop("endDate", e.target.value)}
                        className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alt Hissə - İki Blok */}
              <div>
                <h2 className="text-xl font-bold text-[#5C4977] mb-6">Alt Hissə - İki Blok</h2>

                {bottomBlocks.map((block, index) => (
                  <div key={index} className="mb-6 p-6 border border-[#5C4977]/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-[#5C4977] mb-4">Alt Blok {index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#5C4977] mb-2">
                          Şəkil {block.existingImage ? "(Mövcud şəkil var, yenisini seçmək istəsəniz)" : "*"}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBottomBlockImageChange(index, e)}
                          className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                        />
                        {block.imagePreview && (
                          <div className="mt-4 relative inline-block">
                            <div className="w-64 h-48 overflow-hidden rounded-lg border-2 border-[#5C4977]/20">
                              <img
                                src={block.imagePreview}
                                alt={`Bottom block ${index + 1} preview`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#5C4977] mb-2">
                            Başlıq *
                          </label>
                          <input
                            type="text"
                            value={block.title}
                            onChange={(e) => updateBottomBlock(index, "title", e.target.value)}
                            placeholder="Başlıq"
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#5C4977] mb-2">
                            Yazı *
                          </label>
                          <textarea
                            value={block.description}
                            onChange={(e) => updateBottomBlock(index, "description", e.target.value)}
                            placeholder="Yazı"
                            rows="3"
                            className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Button Yazısı *
                            </label>
                            <input
                              type="text"
                              value={block.buttonText}
                              onChange={(e) => updateBottomBlock(index, "buttonText", e.target.value)}
                              placeholder="View Details"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#5C4977] mb-2">
                              Button Linki *
                            </label>
                            <input
                              type="text"
                              value={block.buttonLink}
                              onChange={(e) => updateBottomBlock(index, "buttonLink", e.target.value)}
                              placeholder="/product/123"
                              className="w-full p-3 border border-[#5C4977]/20 rounded-xl focus:ring-2 focus:ring-[#5C4977] focus:border-transparent transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5C4977] text-white py-4 px-4 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5C4977]/20"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                ) : (
                  'Hero Yenilə'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditHero;

