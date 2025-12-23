import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetOrCreateHomePageContentQuery,
  useAddBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useUpdateBlocksOrderMutation,
} from "../../redux/api/pageContentApi";
import { useGetCategoriesQuery } from "../../redux/api/categoryApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaImage } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditPageContent = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetOrCreateHomePageContentQuery();
  const { data: categoriesApiData } = useGetCategoriesQuery();
  const [addBlock, { isLoading: isAdding }] = useAddBlockMutation();
  const [updateBlock, { isLoading: isUpdating }] = useUpdateBlockMutation();
  const [deleteBlock, { isLoading: isDeleting }] = useDeleteBlockMutation();
  const [updateBlocksOrder, { isLoading: isUpdatingOrder }] = useUpdateBlocksOrderMutation();

  const pageContent = data?.pageContent;
  const pageContentId = pageContent?._id;
  const blocks = pageContent?.blocks || [];
  const categories = categoriesApiData?.categories || [];

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState("");
  const [editingBlock, setEditingBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  // DefaultSlider state
  const [sliderData, setSliderData] = useState({
    slides: [
      {
        image: null,
        imagePreview: null,
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
      },
    ],
    rightTop: {
      image: null,
      imagePreview: null,
      title: "",
      buttonText: "",
      buttonLink: "",
      endDate: "",
    },
    bottomBlocks: [
      {
        image: null,
        imagePreview: null,
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
      },
    ],
  });

  // Categories state
  const [categoriesData, setCategoriesData] = useState({
    title: "Popular Kateqoriyalar",
    visibleCategories: [],
  });

  const handleAddSlide = () => {
    setSliderData({
      ...sliderData,
      slides: [
        ...sliderData.slides,
        {
          image: null,
          imagePreview: null,
          title: "",
          description: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
    });
  };

  const handleRemoveSlide = (index) => {
    if (sliderData.slides.length > 1) {
      setSliderData({
        ...sliderData,
        slides: sliderData.slides.filter((_, i) => i !== index),
      });
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...sliderData.slides];
    newSlides[index][field] = value;
    setSliderData({ ...sliderData, slides: newSlides });
  };

  const handleSlideImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSlides = [...sliderData.slides];
      newSlides[index].image = file;
      newSlides[index].imageFile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newSlides[index].imagePreview = reader.result;
        setSliderData({ ...sliderData, slides: newSlides });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightTopChange = (field, value) => {
    setSliderData({
      ...sliderData,
      rightTop: { ...sliderData.rightTop, [field]: value },
    });
  };

  const handleRightTopImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSliderData({
          ...sliderData,
          rightTop: {
            ...sliderData.rightTop,
            image: file,
            imageFile: file,
            imagePreview: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBottomBlock = () => {
    setSliderData({
      ...sliderData,
      bottomBlocks: [
        ...sliderData.bottomBlocks,
        {
          image: null,
          imagePreview: null,
          title: "",
          description: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
    });
  };

  const handleRemoveBottomBlock = (index) => {
    setSliderData({
      ...sliderData,
      bottomBlocks: sliderData.bottomBlocks.filter((_, i) => i !== index),
    });
  };

  const handleBottomBlockChange = (index, field, value) => {
    const newBlocks = [...sliderData.bottomBlocks];
    newBlocks[index][field] = value;
    setSliderData({ ...sliderData, bottomBlocks: newBlocks });
  };

  const handleBottomBlockImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newBlocks = [...sliderData.bottomBlocks];
      newBlocks[index].image = file;
      newBlocks[index].imageFile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newBlocks[index].imagePreview = reader.result;
        setSliderData({ ...sliderData, bottomBlocks: newBlocks });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const existing = categoriesData.visibleCategories.find(
      (vc) => vc.categoryId === categoryId
    );
    if (existing) {
      setCategoriesData({
        ...categoriesData,
        visibleCategories: categoriesData.visibleCategories.filter(
          (vc) => vc.categoryId !== categoryId
        ),
      });
    } else {
      setCategoriesData({
        ...categoriesData,
        visibleCategories: [
          ...categoriesData.visibleCategories,
          { categoryId, isVisible: true },
        ],
      });
    }
  };

  const handleSaveBlock = async () => {
    if (!pageContentId) {
      Swal.fire({
        title: "Xəta!",
        text: "Səhifə kontenti tapılmadı",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    if (selectedBlockType === "DefaultSlider") {
      // Validation
      if (sliderData.slides.length === 0) {
        Swal.fire({
          title: "Xəta!",
          text: "Ən azı bir slide əlavə edin",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      for (let i = 0; i < sliderData.slides.length; i++) {
        const slide = sliderData.slides[i];
        if (!slide.title || !slide.description || !slide.buttonText || !slide.buttonLink) {
          Swal.fire({
            title: "Xəta!",
            text: `Slide ${i + 1} üçün bütün sahələr doldurulmalıdır`,
            icon: "error",
            confirmButtonColor: "#5C4977",
          });
          return;
        }
      }

      if (!sliderData.rightTop.title || !sliderData.rightTop.buttonText || !sliderData.rightTop.buttonLink || !sliderData.rightTop.endDate) {
        Swal.fire({
          title: "Xəta!",
          text: "Sağ üst hissə üçün bütün sahələr doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      for (let i = 0; i < sliderData.bottomBlocks.length; i++) {
        const block = sliderData.bottomBlocks[i];
        if (!block.title || !block.description || !block.buttonText || !block.buttonLink) {
          Swal.fire({
            title: "Xəta!",
            text: `Alt blok ${i + 1} üçün bütün sahələr doldurulmalıdır`,
            icon: "error",
            confirmButtonColor: "#5C4977",
          });
          return;
        }
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "DefaultSlider");
      
      // Prepare slider data without image files
      const sliderDataForJson = {
        slides: sliderData.slides.map(slide => ({
          title: slide.title,
          description: slide.description,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
        })),
        rightTop: {
          title: sliderData.rightTop.title,
          buttonText: sliderData.rightTop.buttonText,
          buttonLink: sliderData.rightTop.buttonLink,
          endDate: sliderData.rightTop.endDate,
        },
        bottomBlocks: sliderData.bottomBlocks.map(block => ({
          title: block.title,
          description: block.description,
          buttonText: block.buttonText,
          buttonLink: block.buttonLink,
        })),
      };
      
      formData.append("blockData", JSON.stringify({ sliderData: sliderDataForJson }));

      // Add images
      sliderData.slides.forEach((slide, index) => {
        if (slide.imageFile) {
          formData.append(`slideImage_${index}`, slide.imageFile);
        }
      });

      if (sliderData.rightTop.imageFile) {
        formData.append("rightTopImage", sliderData.rightTop.imageFile);
      }

      sliderData.bottomBlocks.forEach((block, index) => {
        if (block.imageFile) {
          formData.append(`bottomBlockImage_${index}`, block.imageFile);
        }
      });

      try {
        if (editingBlock) {
          await updateBlock({
            pageContentId,
            blockId: editingBlock._id,
            formData,
          }).unwrap();
        } else {
          await addBlock({
            pageContentId,
            formData,
          }).unwrap();
        }

        Swal.fire({
          title: "Uğurlu!",
          text: editingBlock ? "Blok yeniləndi" : "Blok əlavə edildi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });

        setShowAddBlockModal(false);
        setEditingBlock(null);
        setSelectedBlockType("");
        resetForm();
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "Categories") {
      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "Categories");
      formData.append("blockData", JSON.stringify({ categoriesData }));
      
      try {
        if (editingBlock) {
          await updateBlock({
            pageContentId,
            blockId: editingBlock._id,
            formData,
          }).unwrap();
        } else {
          await addBlock({
            pageContentId,
            formData,
          }).unwrap();
        }

        Swal.fire({
          title: "Uğurlu!",
          text: editingBlock ? "Blok yeniləndi" : "Blok əlavə edildi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });

        setShowAddBlockModal(false);
        setEditingBlock(null);
        setSelectedBlockType("");
        resetForm();
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleDeleteBlock = async (blockId) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu bloku silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed && pageContentId) {
      try {
        await deleteBlock({ pageContentId, blockId }).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Blok uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Blok silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setSelectedBlockType(block.type);

    if (block.type === "DefaultSlider" && block.sliderData) {
      setSliderData({
        slides: block.sliderData.slides?.map((slide) => ({
          ...slide,
          imagePreview: slide.image?.url,
        })) || [],
        rightTop: {
          ...block.sliderData.rightTop,
          imagePreview: block.sliderData.rightTop?.image?.url,
        },
        bottomBlocks: block.sliderData.bottomBlocks?.map((block) => ({
          ...block,
          imagePreview: block.image?.url,
        })) || [],
      });
    } else if (block.type === "Categories" && block.categoriesData) {
      setCategoriesData(block.categoriesData);
    }

    setShowAddBlockModal(true);
  };

  const resetForm = () => {
    setSliderData({
      slides: [
        {
          image: null,
          imagePreview: null,
          title: "",
          description: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
      rightTop: {
        image: null,
        imagePreview: null,
        title: "",
        buttonText: "",
        buttonLink: "",
        endDate: "",
      },
      bottomBlocks: [
        {
          image: null,
          imagePreview: null,
          title: "",
          description: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
    });
    setCategoriesData({
      title: "Popular Kateqoriyalar",
      visibleCategories: [],
    });
  };

  const getBlockTypeLabel = (type) => {
    switch (type) {
      case "DefaultSlider":
        return "Slider";
      case "Categories":
        return "Kateqoriyalar";
      default:
        return type;
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e, blockId) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", blockId);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedBlock(null);
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverIndex(index);
  };

  const handleDragLeave = () => {
    setDraggedOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDraggedOverIndex(null);

    if (!draggedBlock || !pageContentId) return;

    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
    const draggedBlockIndex = sortedBlocks.findIndex((b) => b._id === draggedBlock);

    if (draggedBlockIndex === -1 || draggedBlockIndex === dropIndex) {
      setDraggedBlock(null);
      return;
    }

    // Yeni sıralama yarat
    const newBlocks = [...sortedBlocks];
    const [removed] = newBlocks.splice(draggedBlockIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);

    // Yeni order-ləri təyin et
    const blockOrders = newBlocks.map((block, index) => ({
      blockId: block._id,
      order: index,
    }));

    try {
      await updateBlocksOrder({
        pageContentId,
        blockOrders,
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Blokların sırası yeniləndi",
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || "Sıra yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }

    setDraggedBlock(null);
  };

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Kontent Redaktəsi">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Kontent Redaktəsi">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/admin/contents")}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-[#5C4977] mb-2">
                    Ana Səhifə Kontenti
                  </h1>
                  <p className="text-gray-600">Blokları idarə edin</p>
                </div>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setEditingBlock(null);
                  setSelectedBlockType("");
                  setShowAddBlockModal(true);
                }}
                className="bg-[#5C4977] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#5C4977]/90 focus:ring-2 focus:ring-[#5C4977] focus:ring-offset-2 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5C4977]/20 cursor-pointer"
              >
                <FaPlus className="h-5 w-5" />
                Yeni Blok
              </button>
            </div>
          </div>

          {/* Blocks List */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#5C4977]">Bloklar</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Blokları sürükləyib buraxa bilərsiniz
                </p>
              </div>
              <span className="bg-[#5C4977]/10 text-[#5C4977] text-sm font-medium px-3 py-1 rounded-full">
                {blocks.length || 0} blok
              </span>
            </div>

            <div className="space-y-3">
              {isUpdatingOrder && (
                <div className="text-center py-2 text-[#5C4977] text-sm">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Blokların sırası yenilənir...
                </div>
              )}
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Hələ heç bir blok əlavə edilməyib</p>
                </div>
              ) : (
                [...blocks]
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => (
                    <div
                      key={block._id}
                      draggable={!isUpdatingOrder}
                      onDragStart={(e) => handleDragStart(e, block._id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border transition-all ${
                        isUpdatingOrder
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-move"
                      } ${
                        draggedBlock === block._id
                          ? "opacity-50 border-[#5C4977]"
                          : draggedOverIndex === index
                          ? "border-[#5C4977] border-2 bg-[#5C4977]/5"
                          : "border-gray-200 hover:border-[#5C4977]/30"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-gray-400 cursor-move">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="9" y1="11" x2="9" y2="17"></line>
                              <line x1="15" y1="11" x2="15" y2="17"></line>
                              <line x1="9" y1="7" x2="9" y2="13"></line>
                              <line x1="15" y1="7" x2="15" y2="13"></line>
                            </svg>
                          </div>
                          <div className="bg-[#5C4977]/10 text-[#5C4977] font-bold w-10 h-10 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {getBlockTypeLabel(block.type)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Sıra: {block.order} |{" "}
                            {block.isActive ? "Aktiv" : "Deaktiv"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBlock(block)}
                          disabled={isUpdatingOrder}
                          className="bg-[#5C4977] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <FaEdit className="h-4 w-4" />
                          Redaktə
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block._id)}
                          disabled={isUpdatingOrder}
                          className="bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <FaTrash className="h-4 w-4" />
                          Sil
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Add/Edit Block Modal */}
          {showAddBlockModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#5C4977]">
                      {editingBlock ? "Blok Redaktə Et" : "Yeni Blok Əlavə Et"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddBlockModal(false);
                        setEditingBlock(null);
                        setSelectedBlockType("");
                        resetForm();
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {!selectedBlockType ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Blok Tipini Seçin
                      </h3>
                      <button
                        onClick={() => setSelectedBlockType("DefaultSlider")}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-800">Slider</h4>
                        <p className="text-sm text-gray-500">
                          Ana səhifə üçün slider bloku
                        </p>
                      </button>
                      <button
                        onClick={() => setSelectedBlockType("Categories")}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-800">
                          Kateqoriyalar
                        </h4>
                        <p className="text-sm text-gray-500">
                          Kateqoriyalar bloku
                        </p>
                      </button>
                    </div>
                  ) : selectedBlockType === "DefaultSlider" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Slider Məlumatları</h3>

                      {/* Slides */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Slides</h4>
                          <button
                            onClick={handleAddSlide}
                            className="bg-[#5C4977] text-white py-1 px-3 rounded-lg text-sm hover:bg-[#5C4977]/90 cursor-pointer"
                          >
                            <FaPlus className="inline mr-1" />
                            Slide Əlavə Et
                          </button>
                        </div>
                        {sliderData.slides.map((slide, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 mb-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium">Slide {index + 1}</h5>
                              {sliderData.slides.length > 1 && (
                                <button
                                  onClick={() => handleRemoveSlide(index)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Şəkil
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleSlideImageChange(index, e)
                                  }
                                  className="w-full"
                                />
                                {slide.imagePreview && (
                                  <img
                                    src={slide.imagePreview}
                                    alt="Preview"
                                    className="mt-2 w-full h-32 object-cover rounded"
                                  />
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Başlıq
                                </label>
                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) =>
                                    handleSlideChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Təsvir
                                </label>
                                <textarea
                                  value={slide.description}
                                  onChange={(e) =>
                                    handleSlideChange(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  rows="2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Düymə Mətni
                                </label>
                                <input
                                  type="text"
                                  value={slide.buttonText}
                                  onChange={(e) =>
                                    handleSlideChange(
                                      index,
                                      "buttonText",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Düymə Linki
                                </label>
                                <input
                                  type="text"
                                  value={slide.buttonLink}
                                  onChange={(e) =>
                                    handleSlideChange(
                                      index,
                                      "buttonLink",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Top */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-4">Sağ Üst Hissə</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Şəkil
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleRightTopImageChange}
                              className="w-full"
                            />
                            {sliderData.rightTop.imagePreview && (
                              <img
                                src={sliderData.rightTop.imagePreview}
                                alt="Preview"
                                className="mt-2 w-full h-32 object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Başlıq
                            </label>
                            <input
                              type="text"
                              value={sliderData.rightTop.title}
                              onChange={(e) =>
                                handleRightTopChange("title", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Düymə Mətni
                            </label>
                            <input
                              type="text"
                              value={sliderData.rightTop.buttonText}
                              onChange={(e) =>
                                handleRightTopChange(
                                  "buttonText",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Düymə Linki
                            </label>
                            <input
                              type="text"
                              value={sliderData.rightTop.buttonLink}
                              onChange={(e) =>
                                handleRightTopChange(
                                  "buttonLink",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bitmə Tarixi
                            </label>
                            <input
                              type="datetime-local"
                              value={sliderData.rightTop.endDate}
                              onChange={(e) =>
                                handleRightTopChange("endDate", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Blocks */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Alt Bloklar</h4>
                          <button
                            onClick={handleAddBottomBlock}
                            className="bg-[#5C4977] text-white py-1 px-3 rounded-lg text-sm hover:bg-[#5C4977]/90 cursor-pointer"
                          >
                            <FaPlus className="inline mr-1" />
                            Blok Əlavə Et
                          </button>
                        </div>
                        {sliderData.bottomBlocks.map((block, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 mb-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium">Blok {index + 1}</h5>
                              <button
                                onClick={() => handleRemoveBottomBlock(index)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Şəkil
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleBottomBlockImageChange(index, e)
                                  }
                                  className="w-full"
                                />
                                {block.imagePreview && (
                                  <img
                                    src={block.imagePreview}
                                    alt="Preview"
                                    className="mt-2 w-full h-32 object-cover rounded"
                                  />
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Başlıq
                                </label>
                                <input
                                  type="text"
                                  value={block.title}
                                  onChange={(e) =>
                                    handleBottomBlockChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Təsvir
                                </label>
                                <textarea
                                  value={block.description}
                                  onChange={(e) =>
                                    handleBottomBlockChange(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  rows="2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Düymə Mətni
                                </label>
                                <input
                                  type="text"
                                  value={block.buttonText}
                                  onChange={(e) =>
                                    handleBottomBlockChange(
                                      index,
                                      "buttonText",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Düymə Linki
                                </label>
                                <input
                                  type="text"
                                  value={block.buttonLink}
                                  onChange={(e) =>
                                    handleBottomBlockChange(
                                      index,
                                      "buttonLink",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Kateqoriyalar Məlumatları
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq
                        </label>
                        <input
                          type="text"
                          value={categoriesData.title}
                          onChange={(e) =>
                            setCategoriesData({
                              ...categoriesData,
                              title: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Görünən Kateqoriyalar
                        </label>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                          {categories.length === 0 ? (
                            <p className="text-gray-500">Kateqoriya yoxdur</p>
                          ) : (
                            <div className="space-y-2">
                              {categories.map((category) => {
                                const isSelected =
                                  categoriesData.visibleCategories.some(
                                    (vc) =>
                                      vc.categoryId === category._id ||
                                      vc.categoryId?._id === category._id
                                  );
                                return (
                                  <label
                                    key={category._id}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        handleCategoryToggle(category._id)
                                      }
                                    />
                                    <span>{category.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowAddBlockModal(false);
                        setEditingBlock(null);
                        setSelectedBlockType("");
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Ləğv Et
                    </button>
                    <button
                      onClick={handleSaveBlock}
                      disabled={isAdding || isUpdating}
                      className="px-6 py-2 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isAdding || isUpdating ? (
                        <Loader2 className="h-5 w-5 animate-spin inline" />
                      ) : editingBlock ? (
                        "Yenilə"
                      ) : (
                        "Yadda Saxla"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPageContent;

