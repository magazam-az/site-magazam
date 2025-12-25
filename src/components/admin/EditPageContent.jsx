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
import { useGetAllHeroesQuery, useDeleteHeroMutation, useCreateHeroMutation } from "../../redux/api/heroApi";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";

const EditPageContent = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetOrCreateHomePageContentQuery();
  const { data: categoriesApiData } = useGetCategoriesQuery();
  const { data: heroesData, isLoading: isLoadingHeroes, refetch: refetchHeroes } = useGetAllHeroesQuery();
  const [addBlock, { isLoading: isAdding }] = useAddBlockMutation();
  const [updateBlock, { isLoading: isUpdating }] = useUpdateBlockMutation();
  const [deleteBlock, { isLoading: isDeleting }] = useDeleteBlockMutation();
  const [updateBlocksOrder, { isLoading: isUpdatingOrder }] = useUpdateBlocksOrderMutation();
  const [deleteHero] = useDeleteHeroMutation();
  const [createHero, { isLoading: isCreatingHero }] = useCreateHeroMutation();

  const pageContent = data?.pageContent;
  const pageContentId = pageContent?._id;
  const blocks = pageContent?.blocks || [];
  const categories = categoriesApiData?.categories || [];
  const heroes = heroesData?.heroes || [];

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState("");
  const [editingBlock, setEditingBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [showAddHeroModal, setShowAddHeroModal] = useState(false);
  
  // Hero form state
  const [heroType, setHeroType] = useState("DefaultSlider");
  const [slides, setSlides] = useState([
    { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
  ]);
  const [rightTop, setRightTop] = useState({
    image: null,
    imagePreview: null,
    title: "",
    buttonText: "",
    buttonLink: "",
    endDate: "",
  });
  const [bottomBlocks, setBottomBlocks] = useState([
    { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" },
    { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
  ]);

  // Categories state
  const [categoriesData, setCategoriesData] = useState({
    title: "Popular Kateqoriyalar",
    visibleCategories: [],
  });

  // BestOffers state
  const [bestOffersData, setBestOffersData] = useState({
    title: "The Best Offers",
    selectedProducts: [],
    moreProductsLink: "",
    moreProductsButtonText: "More Products",
  });

  // NewGoods state
  const [newGoodsData, setNewGoodsData] = useState({
    title: "New Goods",
    selectedProducts: [],
    moreProductsLink: "",
    moreProductsButtonText: "More Products",
    banner: {
      image: null,
      imagePreview: null,
      subtitle: "",
      title: "",
      buttonText: "",
      buttonLink: "",
    },
  });

  // Products for BestOffers and NewGoods selection
  const { data: productsData } = useGetProductsQuery();
  const allProducts = productsData?.products || [];
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [newGoodsSearchTerm, setNewGoodsSearchTerm] = useState("");

  const handleDeleteHero = async (id) => {
    const result = await Swal.fire({
      title: "Əminsiniz?",
      text: "Bu hero-nu silmək istədiyinizə əminsiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (result.isConfirmed) {
      try {
        await deleteHero(id).unwrap();
        Swal.fire({
          title: "Silindi!",
          text: "Hero uğurla silindi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });
        refetchHeroes();
      } catch (error) {
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || "Hero silinərkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tarix yoxdur";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Tarix yoxdur";
      return date.toLocaleDateString('az-AZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Tarix yoxdur";
    }
  };

  // Hero form handlers
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

  const resetHeroForm = () => {
    setHeroType("DefaultSlider");
    setSlides([
      { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
    ]);
    setRightTop({
      image: null,
      imagePreview: null,
      title: "",
      buttonText: "",
      buttonLink: "",
      endDate: "",
    });
    setBottomBlocks([
      { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" },
      { image: null, imagePreview: null, title: "", description: "", buttonText: "", buttonLink: "" }
    ]);
  };

  const handleCreateHero = async (e) => {
    e.preventDefault();

    console.log("=== HERO CREATE START ===");
    console.log("Slides:", slides);
    console.log("RightTop:", rightTop);
    console.log("BottomBlocks:", bottomBlocks);

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
      console.log(`Validating slide ${i}:`, {
        hasImage: !!slide.image,
        title: slide.title,
        description: slide.description,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
      });
      
      if (!slide.image || !slide.title || !slide.description || !slide.buttonText || !slide.buttonLink) {
        Swal.fire({
          title: "Xəta!",
          text: `Slide ${i + 1} üçün bütün sahələr doldurulmalıdır`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    if (!rightTop.image || !rightTop.title || !rightTop.buttonText || !rightTop.buttonLink || !rightTop.endDate) {
      console.error("RightTop validation failed:", rightTop);
      Swal.fire({
        title: "Xəta!",
        text: "Sağ üst hissə üçün bütün sahələr doldurulmalıdır",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    for (let i = 0; i < bottomBlocks.length; i++) {
      const block = bottomBlocks[i];
      console.log(`Validating bottom block ${i}:`, {
        hasImage: !!block.image,
        title: block.title,
        description: block.description,
        buttonText: block.buttonText,
        buttonLink: block.buttonLink,
      });
      
      if (!block.image || !block.title || !block.description || !block.buttonText || !block.buttonLink) {
        Swal.fire({
          title: "Xəta!",
          text: `Alt blok ${i + 1} üçün bütün sahələr doldurulmalıdır`,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    const form = new FormData();
    form.append("type", heroType);
    console.log("Hero type:", heroType);

    // Slide şəkilləri
    let slideImageCount = 0;
    slides.forEach((slide, index) => {
      if (slide.image) {
        form.append(`slideImage_${index}`, slide.image);
        slideImageCount++;
        console.log(`Added slide image ${index}:`, slide.image.name);
      } else {
        console.warn(`Slide ${index} has no image!`);
      }
    });
    console.log(`Total slide images: ${slideImageCount}`);

    // RightTop şəkli
    if (rightTop.image) {
      form.append("rightTopImage", rightTop.image);
      console.log("Added rightTop image:", rightTop.image.name);
    } else {
      console.warn("RightTop has no image!");
    }

    // BottomBlocks şəkilləri
    let bottomBlockImageCount = 0;
    bottomBlocks.forEach((block, index) => {
      if (block.image) {
        form.append(`bottomBlockImage_${index}`, block.image);
        bottomBlockImageCount++;
        console.log(`Added bottom block image ${index}:`, block.image.name);
      } else {
        console.warn(`Bottom block ${index} has no image!`);
      }
    });
    console.log(`Total bottom block images: ${bottomBlockImageCount}`);

    // JSON məlumatları
    const leftSideData = {
      slides: slides.map(slide => ({
        title: slide.title,
        description: slide.description,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
      }))
    };
    form.append("leftSide", JSON.stringify(leftSideData));
    console.log("LeftSide data:", leftSideData);

    const rightTopData = {
      title: rightTop.title,
      buttonText: rightTop.buttonText,
      buttonLink: rightTop.buttonLink,
      endDate: new Date(rightTop.endDate).toISOString(),
    };
    form.append("rightTop", JSON.stringify(rightTopData));
    console.log("RightTop data:", rightTopData);

    const bottomBlocksData = bottomBlocks.map(block => ({
      title: block.title,
      description: block.description,
      buttonText: block.buttonText,
      buttonLink: block.buttonLink,
    }));
    form.append("bottomBlocks", JSON.stringify(bottomBlocksData));
    console.log("BottomBlocks data:", bottomBlocksData);

    // FormData məzmununu yoxla
    console.log("FormData entries:");
    for (let pair of form.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      console.log("Sending createHero request...");
      const result = await createHero(form).unwrap();
      console.log("CreateHero success:", result);

      Swal.fire({
        title: "Uğur!",
        text: "Hero uğurla əlavə edildi",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#5C4977",
      });

      setShowAddHeroModal(false);
      resetHeroForm();
      refetchHeroes();
    } catch (error) {
      console.error("CreateHero error:", error);
      console.error("Error data:", error?.data);
      console.error("Error message:", error?.data?.error || error?.message);
      
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || error?.message || "Hero əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

    if (selectedBlockType === "Categories") {
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
        console.error("Save block error:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "BestOffers") {
      if (!bestOffersData.title || bestOffersData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (bestOffersData.selectedProducts.length === 0) {
        Swal.fire({
          title: "Xəta!",
          text: "Ən azı bir məhsul seçilməlidir",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "BestOffers");
      const blockDataString = JSON.stringify({ bestOffersData });
      formData.append("blockData", blockDataString);
      
      console.log("FormData being sent:");
      console.log("- pageType: home");
      console.log("- blockType: BestOffers");
      console.log("- blockData:", blockDataString);
      
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
        console.error("Save BestOffers block error:", error);
        console.error("Error status:", error?.status);
        console.error("Error data:", error?.data);
        console.error("Error message:", error?.data?.error || error?.data?.message || error?.message);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "NewGoods") {
      if (!newGoodsData.title || newGoodsData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (newGoodsData.selectedProducts.length === 0) {
        Swal.fire({
          title: "Xəta!",
          text: "Ən azı bir məhsul seçilməlidir",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "NewGoods");
      
      // Banner şəkil upload
      if (newGoodsData.banner?.image) {
        formData.append("newGoodsBannerImage", newGoodsData.banner.image);
      }
      
      // Banner məlumatlarını JSON-a çevir (şəkil faylı və imagePreview olmadan)
      const bannerDataForJson = {
        subtitle: newGoodsData.banner?.subtitle || "",
        title: newGoodsData.banner?.title || "",
        buttonText: newGoodsData.banner?.buttonText || "",
        buttonLink: newGoodsData.banner?.buttonLink || "",
        // image və imagePreview JSON-a daxil edilmir - yalnız şəkil faylı FormData-ya göndərilir
      };
      
      const newGoodsDataForJson = {
        title: newGoodsData.title,
        selectedProducts: newGoodsData.selectedProducts,
        moreProductsLink: newGoodsData.moreProductsLink || "",
        moreProductsButtonText: newGoodsData.moreProductsButtonText || "More Products",
        banner: bannerDataForJson,
      };
      
      const blockDataString = JSON.stringify({ newGoodsData: newGoodsDataForJson });
      formData.append("blockData", blockDataString);
      
      console.log("FormData being sent:");
      console.log("- pageType: home");
      console.log("- blockType: NewGoods");
      console.log("- blockData:", blockDataString);
      
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
        console.error("Save NewGoods block error:", error);
        console.error("Error status:", error?.status);
        console.error("Error data:", error?.data);
        console.error("Error message:", error?.data?.error || error?.data?.message || error?.message);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi",
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

    if (block.type === "Categories" && block.categoriesData) {
      setCategoriesData(block.categoriesData);
    }

    if (block.type === "BestOffers" && block.bestOffersData) {
      setBestOffersData({
        ...block.bestOffersData,
        moreProductsLink: block.bestOffersData.moreProductsLink || "",
        moreProductsButtonText: block.bestOffersData.moreProductsButtonText || "More Products",
      });
    }

    if (block.type === "NewGoods" && block.newGoodsData) {
      setNewGoodsData({
        ...block.newGoodsData,
        moreProductsLink: block.newGoodsData.moreProductsLink || "",
        moreProductsButtonText: block.newGoodsData.moreProductsButtonText || "More Products",
        banner: {
          ...block.newGoodsData.banner,
          image: null, // Şəkil faylı yoxdur, yalnız URL var
          imagePreview: block.newGoodsData.banner?.image?.url || null,
        },
      });
    }

    setShowAddBlockModal(true);
  };

  const resetForm = () => {
    setCategoriesData({
      title: "Popular Kateqoriyalar",
      visibleCategories: [],
    });
    setBestOffersData({
      title: "The Best Offers",
      selectedProducts: [],
      moreProductsLink: "",
      moreProductsButtonText: "More Products",
    });
    setNewGoodsData({
      title: "New Goods",
      selectedProducts: [],
      moreProductsLink: "",
      moreProductsButtonText: "More Products",
      banner: {
        image: null,
        imagePreview: null,
        subtitle: "",
        title: "",
        buttonText: "",
        buttonLink: "",
      },
    });
    setProductSearchTerm("");
    setNewGoodsSearchTerm("");
  };

  const getBlockTypeLabel = (type) => {
    switch (type) {
      case "DefaultSlider":
        return "Hero";
      case "Categories":
        return "Kateqoriyalar";
      case "BestOffers":
        return "Ən Yaxşı Təkliflər";
      case "NewGoods":
        return "Yeni Məhsullar";
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
                  .map((block, index) => {
                    // Blok məlumatlarını hazırla
                    let blockDetails = [];
                    
                    if (block.type === "DefaultSlider" && block.sliderData) {
                      const slides = block.sliderData?.slides || [];
                      const rightTop = block.sliderData?.rightTop;
                      const bottomBlocks = block.sliderData?.bottomBlocks || [];
                      const totalImages = slides.length + (rightTop ? 1 : 0) + bottomBlocks.length;
                      
                      blockDetails = [
                        { label: "Slide sayı", value: `${slides.length} slide` },
                        { label: "Şəkil sayı", value: `${totalImages} şəkil` },
                        { label: "Sağ üst", value: rightTop ? "Var" : "Yoxdur" },
                        { label: "Alt bloklar", value: `${bottomBlocks.length} blok` },
                      ];
                    } else if (block.type === "Categories" && block.categoriesData) {
                      const visibleCategories = block.categoriesData?.visibleCategories || [];
                      blockDetails = [
                        { label: "Başlıq", value: block.categoriesData?.title || "Yoxdur" },
                        { label: "Kateqoriya sayı", value: `${visibleCategories.length} kateqoriya` },
                      ];
                    } else if (block.type === "BestOffers" && block.bestOffersData) {
                      const selectedProducts = block.bestOffersData?.selectedProducts || [];
                      blockDetails = [
                        { label: "Başlıq", value: block.bestOffersData?.title || "Yoxdur" },
                        { label: "Məhsul sayı", value: `${selectedProducts.length} məhsul` },
                      ];
                    } else if (block.type === "NewGoods" && block.newGoodsData) {
                      const selectedProducts = block.newGoodsData?.selectedProducts || [];
                      blockDetails = [
                        { label: "Başlıq", value: block.newGoodsData?.title || "Yoxdur" },
                        { label: "Məhsul sayı", value: `${selectedProducts.length} məhsul` },
                      ];
                    }
                    
                    return (
                      <div
                        key={block._id}
                        draggable={!isUpdatingOrder}
                        onDragStart={(e) => handleDragStart(e, block._id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`bg-white rounded-xl border transition-all overflow-hidden ${
                          isUpdatingOrder
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-move"
                        } ${
                          draggedBlock === block._id
                            ? "opacity-50 border-[#5C4977]"
                            : draggedOverIndex === index
                            ? "border-[#5C4977] border-2 bg-[#5C4977]/5"
                            : "border-gray-200 hover:border-[#5C4977]/30 hover:shadow-md"
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-4">
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
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-gray-800 text-lg">
                                    {getBlockTypeLabel(block.type)}
                                  </h3>
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    block.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {block.isActive ? 'Aktiv' : 'Deaktiv'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">
                                  Sıra: {block.order}
                                </p>
                                
                                {/* Blok detalları */}
                                {blockDetails.length > 0 && (
                                  <div className="space-y-2">
                                    {blockDetails.map((detail, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500 font-medium min-w-[100px]">
                                          {detail.label}:
                                        </span>
                                        <span className="text-gray-800">
                                          {detail.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
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
                        </div>
                      </div>
                    );
                  })
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
                        <h4 className="font-semibold text-gray-800">Hero</h4>
                        <p className="text-sm text-gray-500">
                          Ana səhifə üçün hero idarəetməsi
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
                      <button
                        onClick={() => setSelectedBlockType("BestOffers")}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-800">
                          Ən Yaxşı Təkliflər
                        </h4>
                        <p className="text-sm text-gray-500">
                          Seçilmiş məhsullar bloku
                        </p>
                      </button>
                      <button
                        onClick={() => setSelectedBlockType("NewGoods")}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-800">
                          Yeni Məhsullar
                        </h4>
                        <p className="text-sm text-gray-500">
                          Yeni məhsullar bloku
                        </p>
                      </button>
                    </div>
                  ) : selectedBlockType === "DefaultSlider" ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Hero İdarəetməsi</h3>
                        <button
                          onClick={() => {
                            resetHeroForm();
                            setShowAddHeroModal(true);
                          }}
                          className="bg-[#5C4977] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5C4977]/90 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                        >
                          <FaPlus className="h-5 w-5" />
                          Yeni Hero
                        </button>
                      </div>

                      {isLoadingHeroes ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {heroes.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                              <p className="text-gray-500">Heç bir hero tapılmadı</p>
                            </div>
                          ) : (
                            heroes.map((hero) => {
                              const slidesCount = hero.leftSide?.slides?.length || 0;
                              const totalImages = slidesCount + (hero.rightTop?.image ? 1 : 0) + (hero.bottomBlocks?.length || 0);
                              const bottomBlocksCount = hero.bottomBlocks?.length || 0;
                              
                              return (
                                <div
                                  key={hero._id}
                                  className="bg-white rounded-xl border border-[#5C4977]/10 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                >
                                  <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                                          hero.isActive 
                                            ? 'bg-gradient-to-br from-green-500 to-green-600' 
                                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                        }`}>
                                          {hero.isActive ? '✓' : '○'}
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold text-gray-800">
                                            {hero.type || "DefaultSlider"}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                            ID: {hero._id?.slice(-8)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            setShowAddBlockModal(false);
                                            navigate(`/admin/edit-hero/${hero._id}`);
                                          }}
                                          className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                                          title="Redaktə et"
                                        >
                                          <FaEdit className="h-5 w-5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteHero(hero._id)}
                                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                          title="Sil"
                                        >
                                          <FaTrash className="h-5 w-5" />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Status</div>
                                        <div className={`text-sm font-semibold ${
                                          hero.isActive ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                          {hero.isActive ? 'Aktiv' : 'Deaktiv'}
                                        </div>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Slide Sayı</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {slidesCount} slide
                                        </div>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Şəkil Sayı</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {totalImages} şəkil
                                        </div>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Alt Bloklar</div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {bottomBlocksCount} blok
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div className="flex items-center gap-2 text-gray-600">
                                        <span className="font-medium">Yaradılma Tarixi:</span>
                                        <span>{formatDate(hero.createdAt)}</span>
                                      </div>
                                      {hero.updatedAt && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                          <span className="font-medium">Yenilənmə Tarixi:</span>
                                          <span>{formatDate(hero.updatedAt)}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Detallı məlumat */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                                        <div>
                                          <span className="font-medium">Sol Tərəf:</span>
                                          <div className="mt-1">
                                            {slidesCount > 0 ? (
                                              <div className="space-y-1">
                                                {hero.leftSide?.slides?.slice(0, 2).map((slide, idx) => (
                                                  <div key={idx} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#5C4977]"></div>
                                                    <span className="truncate">{slide.title || `Slide ${idx + 1}`}</span>
                                                  </div>
                                                ))}
                                                {slidesCount > 2 && (
                                                  <div className="text-gray-400">+{slidesCount - 2} daha</div>
                                                )}
                                              </div>
                                            ) : (
                                              <span className="text-gray-400">Slide yoxdur</span>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <span className="font-medium">Sağ Üst:</span>
                                          <div className="mt-1">
                                            {hero.rightTop?.title ? (
                                              <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#5C4977]"></div>
                                                <span className="truncate">{hero.rightTop.title}</span>
                                              </div>
                                            ) : (
                                              <span className="text-gray-400">Məlumat yoxdur</span>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <span className="font-medium">Alt Bloklar:</span>
                                          <div className="mt-1">
                                            {bottomBlocksCount > 0 ? (
                                              <div className="space-y-1">
                                                {hero.bottomBlocks?.slice(0, 2).map((block, idx) => (
                                                  <div key={idx} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#5C4977]"></div>
                                                    <span className="truncate">{block.title || `Blok ${idx + 1}`}</span>
                                                  </div>
                                                ))}
                                                {bottomBlocksCount > 2 && (
                                                  <div className="text-gray-400">+{bottomBlocksCount - 2} daha</div>
                                                )}
                                              </div>
                                            ) : (
                                              <span className="text-gray-400">Blok yoxdur</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  ) : selectedBlockType === "BestOffers" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Ən Yaxşı Təkliflər Məlumatları
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={bestOffersData.title}
                          onChange={(e) =>
                            setBestOffersData({
                              ...bestOffersData,
                              title: e.target.value,
                            })
                          }
                          placeholder="The Best Offers"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Məhsulları Seçin *
                        </label>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={productSearchTerm}
                            onChange={(e) => setProductSearchTerm(e.target.value)}
                            placeholder="Məhsul axtar..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                          {allProducts.length === 0 ? (
                            <p className="text-gray-500">Məhsul tapılmadı</p>
                          ) : (
                            <div className="space-y-2">
                              {allProducts
                                .filter((product) => {
                                  if (!productSearchTerm) return true;
                                  const searchLower = productSearchTerm.toLowerCase();
                                  return (
                                    product.name?.toLowerCase().includes(searchLower) ||
                                    product.brand?.toLowerCase().includes(searchLower) ||
                                    product.model?.toLowerCase().includes(searchLower)
                                  );
                                })
                                .map((product) => {
                                  const isSelected = bestOffersData.selectedProducts.includes(
                                    product._id
                                  );
                                  return (
                                    <label
                                      key={product._id}
                                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setBestOffersData({
                                              ...bestOffersData,
                                              selectedProducts: bestOffersData.selectedProducts.filter(
                                                (id) => id !== product._id
                                              ),
                                            });
                                          } else {
                                            setBestOffersData({
                                              ...bestOffersData,
                                              selectedProducts: [
                                                ...bestOffersData.selectedProducts,
                                                product._id,
                                              ],
                                            });
                                          }
                                        }}
                                        className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                                      />
                                      <div className="flex items-center gap-3 flex-1">
                                        <img
                                          src={
                                            product.images?.[0]?.url ||
                                            product.image ||
                                            "https://placehold.co/60x60/6B7280/ffffff?text=No+Image"
                                          }
                                          alt={product.name}
                                          className="w-12 h-12 object-contain rounded border border-gray-200"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://placehold.co/60x60/6B7280/ffffff?text=No+Image";
                                          }}
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">
                                            {product.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {product.brand} {product.model && `- ${product.model}`}
                                          </p>
                                          <p className="text-sm font-semibold text-[#5C4977]">
                                            {typeof product.price === 'number'
                                              ? `${product.price.toFixed(2)} ₼`
                                              : product.price || '0.00 ₼'}
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                        {bestOffersData.selectedProducts.length > 0 && (
                          <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş məhsul sayı: {bestOffersData.selectedProducts.length}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          More Products Button Linki
                        </label>
                        <input
                          type="text"
                          value={bestOffersData.moreProductsLink || ""}
                          onChange={(e) =>
                            setBestOffersData({
                              ...bestOffersData,
                              moreProductsLink: e.target.value,
                            })
                          }
                          placeholder="/products veya https://example.com"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Boş buraxsanız, button göstərilməyəcək
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          More Products Button Text
                        </label>
                        <input
                          type="text"
                          value={bestOffersData.moreProductsButtonText || "More Products"}
                          onChange={(e) =>
                            setBestOffersData({
                              ...bestOffersData,
                              moreProductsButtonText: e.target.value,
                            })
                          }
                          placeholder="More Products"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Button üzərində görünəcək mətn
                        </p>
                      </div>
                    </div>
                  ) : selectedBlockType === "NewGoods" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Yeni Məhsullar Məlumatları
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={newGoodsData.title}
                          onChange={(e) =>
                            setNewGoodsData({
                              ...newGoodsData,
                              title: e.target.value,
                            })
                          }
                          placeholder="New Goods"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>

                      {/* Banner Section */}
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                          Banner Məlumatları
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Banner Şəkil */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Şəkil
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                // Şəkil ölçüsünü yoxla (max 5MB)
                                const maxSize = 5 * 1024 * 1024; // 5MB
                                if (file.size > maxSize) {
                                  Swal.fire({
                                    title: "Xəta!",
                                    text: "Şəkil çox böyükdür. Maksimum ölçü: 5MB",
                                    icon: "error",
                                    confirmButtonColor: "#5C4977",
                                  });
                                  e.target.value = ""; // Reset input
                                  return;
                                }

                                // Şəkil kompress et (daha kiçik ölçü və quality)
                                const compressImage = (file, maxWidth = 1200, maxHeight = 800, quality = 0.7) => {
                                  return new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = (event) => {
                                      const img = new Image();
                                      img.src = event.target.result;
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        let width = img.width;
                                        let height = img.height;

                                        // Ölçüləri hesabla
                                        if (width > height) {
                                          if (width > maxWidth) {
                                            height = (height * maxWidth) / width;
                                            width = maxWidth;
                                          }
                                        } else {
                                          if (height > maxHeight) {
                                            width = (width * maxHeight) / height;
                                            height = maxHeight;
                                          }
                                        }

                                        canvas.width = width;
                                        canvas.height = height;

                                        const ctx = canvas.getContext('2d');
                                        ctx.drawImage(img, 0, 0, width, height);

                                        canvas.toBlob(
                                          (blob) => {
                                            if (!blob) {
                                              reject(new Error("Blob yaradılmadı"));
                                              return;
                                            }
                                            const compressedFile = new File([blob], file.name, {
                                              type: file.type,
                                              lastModified: Date.now(),
                                            });
                                            resolve(compressedFile);
                                          },
                                          file.type,
                                          quality
                                        );
                                      };
                                      img.onerror = () => reject(new Error("Şəkil yüklənmədi"));
                                    };
                                    reader.onerror = () => reject(new Error("Fayl oxunmadı"));
                                  });
                                };

                                try {
                                  let compressedFile = await compressImage(file, 1200, 800, 0.7);
                                  
                                  // Əgər hələ də böyükdürsə, daha çox kompress et
                                  const targetSize = 2 * 1024 * 1024; // 2MB
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 800, 600, 0.6);
                                  }
                                  
                                  // Final yoxlama
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 600, 400, 0.5);
                                  }

                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setNewGoodsData({
                                      ...newGoodsData,
                                      banner: {
                                        ...newGoodsData.banner,
                                        image: compressedFile,
                                        imagePreview: reader.result,
                                      },
                                    });
                                  };
                                  reader.readAsDataURL(compressedFile);
                                } catch (error) {
                                  console.error("Şəkil kompress xətası:", error);
                                  Swal.fire({
                                    title: "Xəta!",
                                    text: "Şəkil işlənmədi. Zəhmət olmasa başqa şəkil seçin.",
                                    icon: "error",
                                    confirmButtonColor: "#5C4977",
                                  });
                                  e.target.value = ""; // Reset input
                                }
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            {newGoodsData.banner?.imagePreview && (
                              <div className="mt-4">
                                <img
                                  src={newGoodsData.banner.imagePreview}
                                  alt="Banner preview"
                                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                            {editingBlock?.newGoodsData?.banner?.image?.url && !newGoodsData.banner?.imagePreview && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Mövcud şəkil:</p>
                                <img
                                  src={editingBlock.newGoodsData.banner.image.url}
                                  alt="Current banner"
                                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                          </div>

                          {/* Subtitle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle (Məs: "AT A GOOD PRICE")
                            </label>
                            <input
                              type="text"
                              value={newGoodsData.banner?.subtitle || ""}
                              onChange={(e) =>
                                setNewGoodsData({
                                  ...newGoodsData,
                                  banner: {
                                    ...newGoodsData.banner,
                                    subtitle: e.target.value,
                                  },
                                })
                              }
                              placeholder="AT A GOOD PRICE"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Başlıq (Məs: "Nothing Phone 1")
                            </label>
                            <input
                              type="text"
                              value={newGoodsData.banner?.title || ""}
                              onChange={(e) =>
                                setNewGoodsData({
                                  ...newGoodsData,
                                  banner: {
                                    ...newGoodsData.banner,
                                    title: e.target.value,
                                  },
                                })
                              }
                              placeholder="Nothing Phone 1"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Button Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Yazısı (Məs: "Buy Now")
                            </label>
                            <input
                              type="text"
                              value={newGoodsData.banner?.buttonText || ""}
                              onChange={(e) =>
                                setNewGoodsData({
                                  ...newGoodsData,
                                  banner: {
                                    ...newGoodsData.banner,
                                    buttonText: e.target.value,
                                  },
                                })
                              }
                              placeholder="Buy Now"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Button Link */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Linki
                            </label>
                            <input
                              type="text"
                              value={newGoodsData.banner?.buttonLink || ""}
                              onChange={(e) =>
                                setNewGoodsData({
                                  ...newGoodsData,
                                  banner: {
                                    ...newGoodsData.banner,
                                    buttonLink: e.target.value,
                                  },
                                })
                              }
                              placeholder="/product/123"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Məhsulları Seçin *
                        </label>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={newGoodsSearchTerm}
                            onChange={(e) => setNewGoodsSearchTerm(e.target.value)}
                            placeholder="Məhsul axtar..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                          {allProducts.length === 0 ? (
                            <p className="text-gray-500">Məhsul tapılmadı</p>
                          ) : (
                            <div className="space-y-2">
                              {allProducts
                                .filter((product) => {
                                  if (!newGoodsSearchTerm) return true;
                                  const searchLower = newGoodsSearchTerm.toLowerCase();
                                  return (
                                    product.name?.toLowerCase().includes(searchLower) ||
                                    product.brand?.toLowerCase().includes(searchLower) ||
                                    product.model?.toLowerCase().includes(searchLower)
                                  );
                                })
                                .map((product) => {
                                  const isSelected = newGoodsData.selectedProducts.includes(
                                    product._id
                                  );
                                  return (
                                    <label
                                      key={product._id}
                                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setNewGoodsData({
                                              ...newGoodsData,
                                              selectedProducts: newGoodsData.selectedProducts.filter(
                                                (id) => id !== product._id
                                              ),
                                            });
                                          } else {
                                            setNewGoodsData({
                                              ...newGoodsData,
                                              selectedProducts: [
                                                ...newGoodsData.selectedProducts,
                                                product._id,
                                              ],
                                            });
                                          }
                                        }}
                                        className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                                      />
                                      <div className="flex items-center gap-3 flex-1">
                                        <img
                                          src={
                                            product.images?.[0]?.url ||
                                            product.image ||
                                            "https://placehold.co/60x60/6B7280/ffffff?text=No+Image"
                                          }
                                          alt={product.name}
                                          className="w-12 h-12 object-contain rounded border border-gray-200"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://placehold.co/60x60/6B7280/ffffff?text=No+Image";
                                          }}
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">
                                            {product.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {product.brand} {product.model && `- ${product.model}`}
                                          </p>
                                          <p className="text-sm font-semibold text-[#5C4977]">
                                            {typeof product.price === 'number'
                                              ? `${product.price.toFixed(2)} ₼`
                                              : product.price || '0.00 ₼'}
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                        {newGoodsData.selectedProducts.length > 0 && (
                          <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş məhsul sayı: {newGoodsData.selectedProducts.length}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          More Products Button Linki
                        </label>
                        <input
                          type="text"
                          value={newGoodsData.moreProductsLink || ""}
                          onChange={(e) =>
                            setNewGoodsData({
                              ...newGoodsData,
                              moreProductsLink: e.target.value,
                            })
                          }
                          placeholder="/products veya https://example.com"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Boş buraxsanız, button göstərilməyəcək
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          More Products Button Text
                        </label>
                        <input
                          type="text"
                          value={newGoodsData.moreProductsButtonText || "More Products"}
                          onChange={(e) =>
                            setNewGoodsData({
                              ...newGoodsData,
                              moreProductsButtonText: e.target.value,
                            })
                          }
                          placeholder="More Products"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Button üzərində görünəcək mətn
                        </p>
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

                  {(selectedBlockType === "Categories" || selectedBlockType === "BestOffers" || selectedBlockType === "NewGoods") && (
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
                  )}
                  {selectedBlockType === "DefaultSlider" && (
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
                        Bağla
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add Hero Modal */}
          {showAddHeroModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#5C4977]">Yeni Hero Əlavə Et</h2>
                    <button
                      onClick={() => {
                        setShowAddHeroModal(false);
                        resetHeroForm();
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateHero} className="p-6 space-y-8" encType="multipart/form-data">
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
                              Şəkil *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlideImageChange(index, e)}
                              className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                              required
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
                          Şəkil *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRightTopImageChange}
                          className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                          required
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
                              Şəkil *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBottomBlockImageChange(index, e)}
                              className="w-full p-3 border-2 border-dashed border-[#5C4977]/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#5C4977]/10 file:text-[#5C4977] hover:file:bg-[#5C4977]/20 cursor-pointer"
                              required
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
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddHeroModal(false);
                        resetHeroForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Ləğv Et
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingHero}
                      className="px-6 py-2 bg-[#5C4977] text-white rounded-lg hover:bg-[#5C4977]/90 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingHero ? (
                        <Loader2 className="h-5 w-5 animate-spin inline" />
                      ) : (
                        "Hero Əlavə Et"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPageContent;

