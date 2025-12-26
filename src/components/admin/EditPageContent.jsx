import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetOrCreateHomePageContentQuery,
  useAddBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useUpdateBlocksOrderMutation,
} from "../../redux/api/pageContentApi";
import { useGetCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllHeroesQuery, useDeleteHeroMutation, useCreateHeroMutation, useUpdateHeroMutation, useUpdateHeroesOrderMutation } from "../../redux/api/heroApi";
import { useGetProductsQuery } from "../../redux/api/productsApi";
import { useGetHomeAppliancesAdminQuery, useUpdateHomeAppliancesMutation } from "../../redux/api/homeAppliancesApi";
import { useGetBlogsQuery } from "../../redux/api/blogApi";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaCopy, FaPowerOff, FaToggleOn } from "react-icons/fa";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import AdminShoppingEvent from "./AdminShoppingEvent";

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
  const [updateHero, { isLoading: isUpdatingHero }] = useUpdateHeroMutation();
  const [updateHeroesOrder, { isLoading: isUpdatingHeroesOrder }] = useUpdateHeroesOrderMutation();

  const pageContent = data?.pageContent;
  const pageContentId = pageContent?._id;
  const allBlocks = pageContent?.blocks || [];
  const categories = categoriesApiData?.categories || [];
  // Hero-ları _id-yə görə unikal et (duplicate-ləri sil) və order-a görə sırala
  const heroes = (heroesData?.heroes || [])
    .filter((hero, index, self) => 
      index === self.findIndex((h) => h._id === hero._id)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  // DefaultSlider bloklarını filtrlə (onlar hero olaraq göstərilir)
  const blocks = allBlocks.filter(block => block.type !== "DefaultSlider");
  
  // Hero'ları ve blokları birleştirip tek bir listede göster (order'a göre sırala)
  const allItems = [
    ...heroes.map(hero => ({ type: 'hero', id: hero._id, data: hero, order: hero.order || 0 })),
    ...blocks.map(block => ({ type: 'block', id: block._id, data: block, order: block.order || 0 }))
  ].sort((a, b) => a.order - b.order);

  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState("");
  const [editingBlock, setEditingBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [showAddHeroModal, setShowAddHeroModal] = useState(false);
  
  // Hero form state
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

  // BestOffers state (deprecated - Products bloğu kullanılacak)
  const [bestOffersData, setBestOffersData] = useState({
    title: "The Best Offers",
    selectedProducts: [],
    moreProductsLink: "",
    moreProductsButtonText: "",
  });

  // NewGoods state (deprecated - Products bloğu kullanılacak)
  const [newGoodsData, setNewGoodsData] = useState({
    title: "New Goods",
    selectedProducts: [],
    moreProductsLink: "",
    moreProductsButtonText: "",
    banner: {
      image: null,
      imagePreview: null,
      subtitle: "",
      title: "",
      buttonText: "",
      buttonLink: "",
    },
  });

  // Products state (BestOffers + NewGoods birleşimi)
  const [productsBlockData, setProductsBlockData] = useState({
    title: "Məhsullar",
    selectedProducts: [],
    moreProductsLink: "",
    moreProductsButtonText: "",
    badgeText: "",
    badgeColor: "#FF0000",
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
  const [homeAppliancesSearchTerm, setHomeAppliancesSearchTerm] = useState("");

  // HomeAppliances state
  const { data: homeAppliancesData, refetch: refetchHomeAppliances } = useGetHomeAppliancesAdminQuery();
  const [updateHomeAppliances, { isLoading: isUpdatingHomeAppliances }] = useUpdateHomeAppliancesMutation();
  const [homeAppliancesFormData, setHomeAppliancesFormData] = useState({
    title: "Home Appliance",
    hotLabel: "Hot",
    selectedProductIds: [],
    isActive: true,
  });

  // Accessories state
  const [accessoryData, setAccessoryData] = useState({
    title: "Microsoft Accessories",
    description: "Personalize your Surface Pro with Microsoft branded accessories. In the presence of many colors for every taste.",
    heroImage: null,
    heroImagePreview: null,
    selectedCategories: [],
    cards: [
      {
        title: "",
        description: "",
        backgroundImage: null,
        backgroundImagePreview: null,
        buttonText: "",
        buttonLink: "",
      },
      {
        title: "",
        description: "",
        backgroundImage: null,
        backgroundImagePreview: null,
        buttonText: "",
        buttonLink: "",
      },
      {
        title: "",
        description: "",
        backgroundImage: null,
        backgroundImagePreview: null,
        buttonText: "",
        buttonLink: "",
      },
    ],
  });

  // Blogs state
  const { data: blogsData } = useGetBlogsQuery();
  const allBlogs = blogsData?.blogs || [];
  const [blogSearchTerm, setBlogSearchTerm] = useState("");
  const [blogData, setBlogData] = useState({
    title: "Məqalələrimiz",
    selectedBlogs: [],
  });

  // About state
  const [aboutData, setAboutData] = useState({
    title: "Online store of household appliances and electronics",
    description: "Then the question arises: where's the content? Not there yet? That's not so bad, there's dummy copy to the rescue. But worse, what if the fish doesn't fit in the can, the foot's to big for the boot? Or to small? To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons.",
    buttonText: "Read More",
  });

  // Load HomeAppliances data when available
  useEffect(() => {
    if (homeAppliancesData?.homeAppliances) {
      const data = homeAppliancesData.homeAppliances;
      setHomeAppliancesFormData({
        title: data.title || "Home Appliance",
        hotLabel: data.hotLabel || "Hot",
        selectedProductIds: data.selectedProductIds?.map(id => id.toString()) || [],
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    }
  }, [homeAppliancesData]);

  // DefaultSlider seçildiğinde direkt hero ekleme formunu aç
  useEffect(() => {
    if (selectedBlockType === "DefaultSlider" && showAddBlockModal && !editingBlock) {
      resetHeroForm();
      setShowAddHeroModal(true);
    }
  }, [selectedBlockType, showAddBlockModal, editingBlock]);

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

  // URL-dən şəkli File obyektinə çevir
  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error converting URL to file:", error);
      throw error;
    }
  };

  const handleDuplicateHero = async (hero) => {
    try {
      // Yükləmə göstəricisi
      Swal.fire({
        title: "Kopyalanır...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const form = new FormData();
      form.append("type", hero.type || "DefaultSlider");

      // Slide şəkillərini yüklə və FormData-ya əlavə et
      if (hero.leftSide?.slides && hero.leftSide.slides.length > 0) {
        for (let i = 0; i < hero.leftSide.slides.length; i++) {
          const slide = hero.leftSide.slides[i];
          if (slide.image?.url) {
            try {
              const file = await urlToFile(slide.image.url, `slide_${i}.jpg`);
              form.append(`slideImage_${i}`, file);
            } catch (error) {
              console.error(`Error loading slide image ${i}:`, error);
            }
          }
        }

        // Slide məlumatları
        const leftSideData = {
          slides: hero.leftSide.slides.map(slide => ({
            title: slide.title || "",
            description: slide.description || "",
            buttonText: slide.buttonText || "",
            buttonLink: slide.buttonLink || "",
          }))
        };
        form.append("leftSide", JSON.stringify(leftSideData));
      }

      // RightTop şəklini yüklə və FormData-ya əlavə et
      if (hero.rightTop?.image?.url) {
        try {
          const file = await urlToFile(hero.rightTop.image.url, "rightTop.jpg");
          form.append("rightTopImage", file);
        } catch (error) {
          console.error("Error loading rightTop image:", error);
        }
      }

      // RightTop məlumatları
      const rightTopData = {
        title: hero.rightTop?.title || "",
        buttonText: hero.rightTop?.buttonText || "",
        buttonLink: hero.rightTop?.buttonLink || "",
        endDate: hero.rightTop?.endDate || "",
      };
      form.append("rightTop", JSON.stringify(rightTopData));

      // BottomBlocks şəkillərini yüklə və FormData-ya əlavə et
      if (hero.bottomBlocks && hero.bottomBlocks.length > 0) {
        for (let i = 0; i < hero.bottomBlocks.length; i++) {
          const block = hero.bottomBlocks[i];
          if (block.image?.url) {
            try {
              const file = await urlToFile(block.image.url, `bottomBlock_${i}.jpg`);
              form.append(`bottomBlockImage_${i}`, file);
            } catch (error) {
              console.error(`Error loading bottomBlock image ${i}:`, error);
            }
          }
        }

        // BottomBlocks məlumatları
        const bottomBlocksData = hero.bottomBlocks.map(block => ({
          title: block.title || "",
          description: block.description || "",
          buttonText: block.buttonText || "",
          buttonLink: block.buttonLink || "",
        }));
        form.append("bottomBlocks", JSON.stringify(bottomBlocksData));
      }

      await createHero(form).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Hero uğurla kopyalandı",
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 2000,
        showConfirmButton: false,
      });

      refetchHeroes();
    } catch (error) {
      console.error("Duplicate hero error:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || error?.data?.message || error?.message || "Hero kopyalanarkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
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

  const handleSlideImageChange = async (index, e) => {
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

    try {
      // Şəkil kompress et
      let compressedFile = await compressImage(file, 1200, 800, 0.7);
      
      // Əgər hələ də böyükdürsə, daha çox kompress et
      const targetSize = 1.5 * 1024 * 1024; // 1.5MB (hero slide üçün)
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 1000, 700, 0.6);
      }
      
      // Final yoxlama
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 800, 600, 0.5);
      }

      console.log(`Kompress edilmiş slide ${index} şəkil ölçüsü:`, compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

      const newSlides = [...slides];
      newSlides[index].image = compressedFile;
      const reader = new FileReader();
      reader.onloadend = () => {
        newSlides[index].imagePreview = reader.result;
        setSlides(newSlides);
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
  };

  const updateRightTop = (field, value) => {
    setRightTop({ ...rightTop, [field]: value });
  };

  const handleRightTopImageChange = async (e) => {
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

    try {
      // Şəkil kompress et
      let compressedFile = await compressImage(file, 1000, 800, 0.7);
      
      // Əgər hələ də böyükdürsə, daha çox kompress et
      const targetSize = 1.5 * 1024 * 1024; // 1.5MB (rightTop üçün)
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 800, 600, 0.6);
      }
      
      // Final yoxlama
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 600, 400, 0.5);
      }

      console.log("Kompress edilmiş rightTop şəkil ölçüsü:", compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

      const reader = new FileReader();
      reader.onloadend = () => {
        setRightTop({ ...rightTop, image: compressedFile, imagePreview: reader.result });
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
  };

  const updateBottomBlock = (index, field, value) => {
    const newBlocks = [...bottomBlocks];
    newBlocks[index][field] = value;
    setBottomBlocks(newBlocks);
  };

  const handleBottomBlockImageChange = async (index, e) => {
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

    try {
      // Şəkil kompress et
      let compressedFile = await compressImage(file, 800, 600, 0.7);
      
      // Əgər hələ də böyükdürsə, daha çox kompress et
      const targetSize = 1 * 1024 * 1024; // 1MB (bottom block üçün)
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 600, 400, 0.6);
      }
      
      // Final yoxlama
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 400, 300, 0.5);
      }

      console.log(`Kompress edilmiş bottom block ${index} şəkil ölçüsü:`, compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

      const newBlocks = [...bottomBlocks];
      newBlocks[index].image = compressedFile;
      const reader = new FileReader();
      reader.onloadend = () => {
        newBlocks[index].imagePreview = reader.result;
        setBottomBlocks(newBlocks);
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
  };

  const resetHeroForm = () => {
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

    // endDate validation - düzgün formatda olub-olmadığını yoxla
    let isValidEndDate = false;
    if (rightTop.endDate) {
      try {
        const date = new Date(rightTop.endDate);
        isValidEndDate = !isNaN(date.getTime());
      } catch (error) {
        isValidEndDate = false;
      }
    }

    if (!rightTop.image || !rightTop.title || !rightTop.buttonText || !rightTop.buttonLink || !rightTop.endDate || !isValidEndDate) {
      console.error("RightTop validation failed:", rightTop);
      Swal.fire({
        title: "Xəta!",
        text: !isValidEndDate && rightTop.endDate 
          ? "Bitmə tarixi düzgün formatda deyil" 
          : "Sağ üst hissə üçün bütün sahələr doldurulmalıdır",
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
    form.append("type", "DefaultSlider");
    console.log("Hero type: DefaultSlider");

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

    // endDate-i düzgün formatla
    let endDateISO = "";
    if (rightTop.endDate) {
      try {
        const date = new Date(rightTop.endDate);
        if (!isNaN(date.getTime())) {
          endDateISO = date.toISOString();
        } else {
          console.error("Invalid endDate value:", rightTop.endDate);
          Swal.fire({
            title: "Xəta!",
            text: "Bitmə tarixi düzgün formatda deyil",
            icon: "error",
            confirmButtonColor: "#5C4977",
          });
          return;
        }
      } catch (error) {
        console.error("Date parsing error:", error);
        Swal.fire({
          title: "Xəta!",
          text: "Bitmə tarixi işlənmədi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }
    }

    const rightTopData = {
      title: rightTop.title,
      buttonText: rightTop.buttonText,
      buttonLink: rightTop.buttonLink,
      endDate: endDateISO,
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
    let totalFormDataSize = 0;
    console.log("FormData entries:");
    for (let pair of form.entries()) {
      if (pair[1] instanceof File) {
        totalFormDataSize += pair[1].size;
        console.log(`${pair[0]}: [File] ${pair[1].name} (${(pair[1].size / 1024 / 1024).toFixed(2)}MB)`);
      } else {
        const textSize = new TextEncoder().encode(pair[1]).length;
        totalFormDataSize += textSize;
        console.log(`${pair[0]}: ${pair[1].substring(0, 100)}... (${textSize} bytes)`);
      }
    }
    console.log(`Total FormData size: ${(totalFormDataSize / 1024 / 1024).toFixed(2)}MB`);

    try {
      console.log("Sending createHero request...");
      const result = await createHero(form).unwrap();
      console.log("CreateHero success:", result);

      // Eğer blok ekleme modalı açıksa ve DefaultSlider seçildiyse, hero'yu blok olarak da ekle
      if (showAddBlockModal && selectedBlockType === "DefaultSlider" && pageContentId && result?.hero?._id) {
        try {
          const formData = new FormData();
          formData.append("pageType", "home");
          formData.append("blockType", "DefaultSlider");
          formData.append("blockData", JSON.stringify({ heroId: result.hero._id }));

          await addBlock({
            pageContentId,
            formData,
          }).unwrap();

          Swal.fire({
            title: "Uğurlu!",
            text: "Hero və blok uğurla əlavə edildi",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: "#5C4977",
          });

          setShowAddHeroModal(false);
          setShowAddBlockModal(false);
          setSelectedBlockType("");
          resetHeroForm();
          refetchHeroes();
          refetch();
          return;
        } catch (blockError) {
          console.error("Add block error:", blockError);
          // Hero oluşturuldu ama blok eklenemedi, yine de devam et
        }
      }

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

  const handleAccessoryCategoryToggle = (categoryId) => {
    const categoryIdStr = categoryId.toString();
    if (accessoryData.selectedCategories.includes(categoryIdStr)) {
      setAccessoryData({
        ...accessoryData,
        selectedCategories: accessoryData.selectedCategories.filter(
          (id) => id !== categoryIdStr
        ),
      });
    } else {
      setAccessoryData({
        ...accessoryData,
        selectedCategories: [...accessoryData.selectedCategories, categoryIdStr],
      });
    }
  };

  const handleBlogToggle = (blogId) => {
    const blogIdStr = blogId.toString();
    if (blogData.selectedBlogs.includes(blogIdStr)) {
      setBlogData({
        ...blogData,
        selectedBlogs: blogData.selectedBlogs.filter(
          (id) => id !== blogIdStr
        ),
      });
    } else {
      setBlogData({
        ...blogData,
        selectedBlogs: [...blogData.selectedBlogs, blogIdStr],
      });
    }
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...accessoryData.cards];
    newCards[index] = {
      ...newCards[index],
      [field]: value,
    };
    setAccessoryData({
      ...accessoryData,
      cards: newCards,
    });
  };

  // Şəkil kompress funksiyası
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

          // JPEG formatına çevir (daha kiçik ölçü)
          const outputType = 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Blob yaradılmadı"));
                return;
              }
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            outputType,
            quality
          );
        };
        img.onerror = () => reject(new Error("Şəkil yüklənmədi"));
      };
      reader.onerror = () => reject(new Error("Fayl oxunmadı"));
    });
  };

  const handleCardImageChange = async (index, file) => {
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
      return;
    }

    try {
      // Şəkil kompress et
      let compressedFile = await compressImage(file, 800, 600, 0.6);
      
      // Əgər hələ də böyükdürsə, daha çox kompress et
      const targetSize = 1 * 1024 * 1024; // 1MB
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 600, 400, 0.5);
      }
      
      // Final yoxlama - ən kiçik ölçü
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 400, 300, 0.4);
      }

      console.log("Kompress edilmiş şəkil ölçüsü:", compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newCards = [...accessoryData.cards];
        newCards[index] = {
          ...newCards[index],
          backgroundImage: compressedFile,
          backgroundImagePreview: reader.result,
        };
        setAccessoryData({
          ...accessoryData,
          cards: newCards,
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
    }
  };

  const handleHeroImageChange = async (file) => {
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
      return;
    }

    try {
      // Şəkil kompress et
      let compressedFile = await compressImage(file, 1000, 800, 0.7);
      
      // Əgər hələ də böyükdürsə, daha çox kompress et
      const targetSize = 1.5 * 1024 * 1024; // 1.5MB (hero image üçün bir az daha böyük)
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 800, 600, 0.6);
      }
      
      // Final yoxlama
      if (compressedFile.size > targetSize) {
        compressedFile = await compressImage(file, 600, 400, 0.5);
      }

      console.log("Kompress edilmiş hero şəkil ölçüsü:", compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAccessoryData({
          ...accessoryData,
          heroImage: compressedFile,
          heroImagePreview: reader.result,
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
    } else if (selectedBlockType === "Products") {
      // Required fields validation
      if (!productsBlockData.title || productsBlockData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (productsBlockData.selectedProducts.length === 0) {
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
      formData.append("blockType", "Products");
      
      // Banner şəkil upload (optional)
      if (productsBlockData.banner?.image) {
        console.log("Banner şəkil ölçüsü:", productsBlockData.banner.image.size, "bytes", `(${(productsBlockData.banner.image.size / 1024 / 1024).toFixed(2)}MB)`);
        formData.append("productsBannerImage", productsBlockData.banner.image);
      }
      
      // Banner məlumatlarını JSON-a çevir (şəkil faylı və imagePreview olmadan)
      const bannerDataForJson = {
        subtitle: productsBlockData.banner?.subtitle || "",
        title: productsBlockData.banner?.title || "",
        buttonText: productsBlockData.banner?.buttonText || "",
        buttonLink: productsBlockData.banner?.buttonLink || "",
      };
      
      const productsDataForJson = {
        title: productsBlockData.title,
        selectedProducts: productsBlockData.selectedProducts,
        moreProductsLink: productsBlockData.moreProductsLink || "",
        moreProductsButtonText: productsBlockData.moreProductsButtonText || "",
        badgeText: productsBlockData.badgeText || "",
        badgeColor: productsBlockData.badgeColor || "#FF0000",
        banner: bannerDataForJson,
      };
      
      const blockDataString = JSON.stringify({ productsData: productsDataForJson });
      formData.append("blockData", blockDataString);
      
      console.log("FormData being sent:");
      console.log("- pageType: home");
      console.log("- blockType: Products");
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
        console.error("Save Products block error:", error);
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
        console.log("Banner şəkil ölçüsü:", newGoodsData.banner.image.size, "bytes", `(${(newGoodsData.banner.image.size / 1024 / 1024).toFixed(2)}MB)`);
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
        moreProductsButtonText: newGoodsData.moreProductsButtonText || "",
        banner: bannerDataForJson,
      };
      
      const blockDataString = JSON.stringify({ newGoodsData: newGoodsDataForJson });
      formData.append("blockData", blockDataString);
      
      // FormData ölçüsünü yoxla
      let formDataSize = blockDataString.length;
      if (newGoodsData.banner?.image) {
        formDataSize += newGoodsData.banner.image.size;
      }
      
      console.log("FormData being sent:");
      console.log("- pageType: home");
      console.log("- blockType: NewGoods");
      console.log("- blockData size:", blockDataString.length, "bytes");
      console.log("- Image size:", newGoodsData.banner?.image?.size || 0, "bytes");
      console.log("- Total FormData size:", formDataSize, "bytes", `(${(formDataSize / 1024 / 1024).toFixed(2)}MB)`);
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
    } else if (selectedBlockType === "ShoppingEvent") {
      // ShoppingEvent is managed separately via its own form
      // This just adds the block type to the page content
      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "ShoppingEvent");

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
          text: editingBlock ? "Shopping Event bloku yeniləndi" : "Shopping Event bloku əlavə edildi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });

        setShowAddBlockModal(false);
        setEditingBlock(null);
        setSelectedBlockType("");
        resetForm();
        refetch();
      } catch (error) {
        console.error("Save ShoppingEvent block error:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Shopping Event bloku saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "HomeAppliances") {
      // HomeAppliances is managed via its own API, but also saved as PageContent block
      if (!homeAppliancesFormData.title || homeAppliancesFormData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (!homeAppliancesFormData.hotLabel || homeAppliancesFormData.hotLabel.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Hot etiketi doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      try {
        // Update HomeAppliances API
        await updateHomeAppliances({
          title: homeAppliancesFormData.title.trim(),
          hotLabel: homeAppliancesFormData.hotLabel.trim(),
          selectedProductIds: homeAppliancesFormData.selectedProductIds,
          isActive: homeAppliancesFormData.isActive,
        }).unwrap();

        // Also add/update as PageContent block
        const formData = new FormData();
        formData.append("pageType", "home");
        formData.append("blockType", "HomeAppliances");

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
          text: editingBlock ? "Home Appliances yeniləndi" : "Home Appliances əlavə edildi",
          icon: "success",
          confirmButtonColor: "#5C4977",
        });

        setShowAddBlockModal(false);
        setEditingBlock(null);
        setSelectedBlockType("");
        resetForm();
        refetch();
        refetchHomeAppliances();
      } catch (error) {
        console.error("Save HomeAppliances error:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Home Appliances saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "Accessories") {
      if (!accessoryData.title || accessoryData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "Accessories");
      
      // Hero image upload
      if (accessoryData.heroImage) {
        console.log("Hero image being uploaded:", {
          name: accessoryData.heroImage.name,
          size: accessoryData.heroImage.size,
          type: accessoryData.heroImage.type,
        });
        formData.append("accessoryHeroImage", accessoryData.heroImage);
      }
      
      // Card images upload
      accessoryData.cards.forEach((card, index) => {
        if (card.backgroundImage) {
          console.log(`Card ${index} image being uploaded:`, {
            name: card.backgroundImage.name,
            size: card.backgroundImage.size,
            type: card.backgroundImage.type,
          });
          formData.append(`accessoryCardImage${index}`, card.backgroundImage);
        }
      });
      
      // Accessory data for JSON (without file objects)
      const accessoryDataForJson = {
        title: accessoryData.title,
        description: accessoryData.description || "",
        selectedCategories: accessoryData.selectedCategories,
        cards: accessoryData.cards.map(card => ({
          title: card.title || "",
          description: card.description || "",
          buttonText: card.buttonText || "",
          buttonLink: card.buttonLink || "",
        })),
      };
      
      const blockDataString = JSON.stringify({ accessoryData: accessoryDataForJson });
      formData.append("blockData", blockDataString);
      
      // Log FormData contents
      console.log("=== Accessories FormData ===");
      console.log("pageType: home");
      console.log("blockType: Accessories");
      console.log("blockData:", blockDataString);
      console.log("Hero image:", accessoryData.heroImage ? "Yes" : "No");
      console.log("Card images:", accessoryData.cards.filter(c => c.backgroundImage).length);
      console.log("Total FormData entries:", Array.from(formData.entries()).length);
      
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
        console.error("Save Accessories block error:", error);
        console.error("Error status:", error?.status);
        console.error("Error data:", error?.data);
        console.error("Error message:", error?.message);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        
        const errorMessage = error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi";
        Swal.fire({
          title: "Xəta!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "Blogs") {
      if (!blogData.title || blogData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "Blogs");
      
      const blogDataForJson = {
        title: blogData.title,
        selectedBlogs: blogData.selectedBlogs,
      };
      
      const blockDataString = JSON.stringify({ blogData: blogDataForJson });
      formData.append("blockData", blockDataString);
      
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
        console.error("Save Blogs block error:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    } else if (selectedBlockType === "About") {
      if (!aboutData.title || aboutData.title.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Başlıq doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      if (!aboutData.description || aboutData.description.trim() === "") {
        Swal.fire({
          title: "Xəta!",
          text: "Təsvir doldurulmalıdır",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
        return;
      }

      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", "About");
      
      const aboutDataForJson = {
        title: aboutData.title,
        description: aboutData.description,
        buttonText: aboutData.buttonText || "Read More",
      };
      
      const blockDataString = JSON.stringify({ aboutData: aboutDataForJson });
      formData.append("blockData", blockDataString);
      
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
        console.error("Save About block error:", error);
        Swal.fire({
          title: "Xəta!",
          text: error?.data?.error || error?.data?.message || error?.message || "Blok saxlanarkən xəta baş verdi",
          icon: "error",
          confirmButtonColor: "#5C4977",
        });
      }
    }
  };

  const handleToggleBlockActive = async (blockId, currentStatus) => {
    if (!pageContentId) return;

    try {
      const formData = new FormData();
      formData.append("blockData", JSON.stringify({ isActive: !currentStatus }));

      await updateBlock({
        pageContentId,
        blockId,
        formData,
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: `Blok ${!currentStatus ? "aktivləşdirildi" : "deaktivləşdirildi"}`,
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || error?.data?.message || "Blok statusu yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleToggleHeroActive = async (heroId, currentStatus) => {
    try {
      await updateHero({
        id: heroId,
        heroData: { isActive: !currentStatus },
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: `Hero ${!currentStatus ? "aktivləşdirildi" : "deaktivləşdirildi"}`,
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 1500,
        showConfirmButton: false,
      });

      refetchHeroes();
    } catch (error) {
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || error?.data?.message || "Hero statusu yenilənərkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
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

  const handleDuplicateBlock = async (block) => {
    if (!pageContentId) {
      Swal.fire({
        title: "Xəta!",
        text: "Səhifə məlumatı tapılmadı",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
      return;
    }

    try {
      // Yükləmə göstəricisi
      Swal.fire({
        title: "Kopyalanır...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Blokun məlumatlarını hazırla
      const formData = new FormData();
      formData.append("pageType", "home");
      formData.append("blockType", block.type);

      // Blok tipinə görə məlumatları əlavə et (backend nested structure gözləyir)
      const blockData = {};
      
      if (block.type === "Categories" && block.categoriesData) {
        blockData.categoriesData = block.categoriesData;
      } else if (block.type === "BestOffers" && block.bestOffersData) {
        blockData.bestOffersData = block.bestOffersData;
      } else if (block.type === "NewGoods" && block.newGoodsData) {
        blockData.newGoodsData = block.newGoodsData;
      } else if (block.type === "ShoppingEvent") {
        // ShoppingEvent üçün xüsusi məlumat yoxdur
      } else if (block.type === "HomeAppliances") {
        // HomeAppliances üçün xüsusi məlumat yoxdur
      } else if (block.type === "Accessories" && block.accessoryData) {
        blockData.accessoryData = block.accessoryData;
      } else if (block.type === "Blogs" && block.blogData) {
        blockData.blogData = block.blogData;
      } else if (block.type === "About" && block.aboutData) {
        blockData.aboutData = block.aboutData;
      }
      
      formData.append("blockData", JSON.stringify(blockData));

      await addBlock({
        pageContentId,
        formData,
      }).unwrap();

      Swal.fire({
        title: "Uğurlu!",
        text: "Blok uğurla kopyalandı",
        icon: "success",
        confirmButtonColor: "#5C4977",
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      console.error("Duplicate block error:", error);
      Swal.fire({
        title: "Xəta!",
        text: error?.data?.error || error?.data?.message || error?.message || "Blok kopyalanarkən xəta baş verdi",
        icon: "error",
        confirmButtonColor: "#5C4977",
      });
    }
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setSelectedBlockType(block.type);

    if (block.type === "Categories" && block.categoriesData) {
      setCategoriesData(block.categoriesData);
    }

    if (block.type === "Products" && block.productsData) {
      setProductsBlockData({
        title: block.productsData.title || "Məhsullar",
        selectedProducts: block.productsData.selectedProducts || [],
        moreProductsLink: block.productsData.moreProductsLink || "",
        moreProductsButtonText: block.productsData.moreProductsButtonText || "",
        badgeText: block.productsData.badgeText || "",
        badgeColor: block.productsData.badgeColor || "#FF0000",
        banner: {
          image: null,
          imagePreview: block.productsData.banner?.image?.url || null,
          subtitle: block.productsData.banner?.subtitle || "",
          title: block.productsData.banner?.title || "",
          buttonText: block.productsData.banner?.buttonText || "",
          buttonLink: block.productsData.banner?.buttonLink || "",
        },
      });
    }

    if (block.type === "BestOffers" && block.bestOffersData) {
      setBestOffersData({
        ...block.bestOffersData,
        moreProductsLink: block.bestOffersData.moreProductsLink || "",
        moreProductsButtonText: block.bestOffersData.moreProductsButtonText || "",
      });
    }

    if (block.type === "NewGoods" && block.newGoodsData) {
      setNewGoodsData({
        ...block.newGoodsData,
        moreProductsLink: block.newGoodsData.moreProductsLink || "",
        moreProductsButtonText: block.newGoodsData.moreProductsButtonText || "",
        banner: {
          ...block.newGoodsData.banner,
          image: null, // Şəkil faylı yoxdur, yalnız URL var
          imagePreview: block.newGoodsData.banner?.image?.url || null,
        },
      });
    }

    if (block.type === "HomeAppliances") {
      // HomeAppliances data is loaded from API via useEffect, so we just open the modal
      // The useEffect will populate the form data
    }

    if (block.type === "Accessories" && block.accessoryData) {
      setAccessoryData({
        title: block.accessoryData.title || "Microsoft Accessories",
        description: block.accessoryData.description || "",
        heroImage: null,
        heroImagePreview: block.accessoryData.heroImage?.url || null,
        selectedCategories: block.accessoryData.selectedCategories?.map(id => id.toString()) || [],
        cards: block.accessoryData.cards?.map(card => ({
          title: card.title || "",
          description: card.description || "",
          backgroundImage: null,
          backgroundImagePreview: card.backgroundImage?.url || null,
          buttonText: card.buttonText || "",
          buttonLink: card.buttonLink || "",
        })) || [
          {
            title: "",
            description: "",
            backgroundImage: null,
            backgroundImagePreview: null,
            buttonText: "",
            buttonLink: "",
          },
          {
            title: "",
            description: "",
            backgroundImage: null,
            backgroundImagePreview: null,
            buttonText: "",
            buttonLink: "",
          },
          {
            title: "",
            description: "",
            backgroundImage: null,
            backgroundImagePreview: null,
            buttonText: "",
            buttonLink: "",
          },
        ],
      });
    }

    if (block.type === "Blogs" && block.blogData) {
      setBlogData({
        title: block.blogData.title || "Məqalələrimiz",
        selectedBlogs: block.blogData.selectedBlogs?.map(id => id.toString()) || [],
      });
    }

    if (block.type === "About" && block.aboutData) {
      setAboutData({
        title: block.aboutData.title || "Online store of household appliances and electronics",
        description: block.aboutData.description || "",
        buttonText: block.aboutData.buttonText || "Read More",
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
      moreProductsButtonText: "",
    });
    setNewGoodsData({
      title: "New Goods",
      selectedProducts: [],
      moreProductsLink: "",
      moreProductsButtonText: "",
      banner: {
        image: null,
        imagePreview: null,
        subtitle: "",
        title: "",
        buttonText: "",
        buttonLink: "",
      },
    });
    setProductsBlockData({
      title: "Məhsullar",
      selectedProducts: [],
      moreProductsLink: "",
      moreProductsButtonText: "",
      badgeText: "",
      badgeColor: "#FF0000",
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
    setHomeAppliancesSearchTerm("");
    setHomeAppliancesFormData({
      title: "Home Appliance",
      hotLabel: "Hot",
      selectedProductIds: [],
      isActive: true,
    });
    setAccessoryData({
      title: "Microsoft Accessories",
      description: "Personalize your Surface Pro with Microsoft branded accessories. In the presence of many colors for every taste.",
      heroImage: null,
      heroImagePreview: null,
      selectedCategories: [],
      cards: [
        {
          title: "",
          description: "",
          backgroundImage: null,
          backgroundImagePreview: null,
          buttonText: "",
          buttonLink: "",
        },
        {
          title: "",
          description: "",
          backgroundImage: null,
          backgroundImagePreview: null,
          buttonText: "",
          buttonLink: "",
        },
        {
          title: "",
          description: "",
          backgroundImage: null,
          backgroundImagePreview: null,
          buttonText: "",
          buttonLink: "",
        },
      ],
    });
    setBlogData({
      title: "Məqalələrimiz",
      selectedBlogs: [],
    });
    setBlogSearchTerm("");
    setAboutData({
      title: "Online store of household appliances and electronics",
      description: "Then the question arises: where's the content? Not there yet? That's not so bad, there's dummy copy to the rescue. But worse, what if the fish doesn't fit in the can, the foot's to big for the boot? Or to small? To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons.",
      buttonText: "Read More",
    });
  };

  const getBlockTypeLabel = (type) => {
    switch (type) {
      case "DefaultSlider":
        return "Hero";
      case "Categories":
        return "Kateqoriyalar";
      case "Products":
        return "Məhsullar";
      case "BestOffers":
        return "Ən Yaxşı Təkliflər";
      case "NewGoods":
        return "Yeni Məhsullar";
      case "ShoppingEvent":
        return "Shopping Event";
      case "HomeAppliances":
        return "Home Appliances";
      case "Accessories":
        return "Accessories";
      case "Blogs":
        return "Blogs";
      case "About":
        return "About";
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
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">
                  Ana Səhifə Kontenti
                </h1>
                <p className="text-gray-600">Blokları idarə edin</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/admin/contents")}
                  className="flex items-center gap-2 text-[#5C4977] hover:text-[#5C4977]/70 font-medium transition-colors border border-[#5C4977] hover:bg-[#5C4977]/5 px-4 py-2 rounded-xl cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Geri qayıt
                </button>
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
                {heroes.length + blocks.length} blok
              </span>
            </div>

            <div className="space-y-3">
              {isUpdatingOrder && (
                <div className="text-center py-2 text-[#5C4977] text-sm">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Blokların sırası yenilənir...
                </div>
              )}
              {heroes.length === 0 && blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Hələ heç bir blok əlavə edilməyib</p>
                </div>
              ) : (
                <>
                  {/* Hero-ları və blokları birleştirilmiş listede göster */}
                  {!isLoadingHeroes && allItems.map((item, itemIndex) => {
                    const isHero = item.type === 'hero';
                    const itemId = isHero ? `hero-${item.id}` : item.id;
                    const totalIndex = itemIndex;
                    const hero = isHero ? item.data : null;
                    const block = !isHero ? item.data : null;
                    
                    // Hero render
                    if (isHero && hero) {
                      return (
                        <div
                          key={itemId}
                          draggable={!isUpdatingOrder}
                          onDragStart={(e) => {
                            setDraggedBlock(itemId);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/html", itemId);
                            e.dataTransfer.setData("type", "hero");
                            e.currentTarget.style.opacity = "0.5";
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = "1";
                            setDraggedBlock(null);
                            setDraggedOverIndex(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            setDraggedOverIndex(totalIndex);
                          }}
                          onDragLeave={() => {
                            setDraggedOverIndex(null);
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setDraggedOverIndex(null);
                            
                            if (!draggedBlock || draggedBlock === itemId) return;
                            
                            const draggedType = e.dataTransfer.getData("type");
                            
                            // Hero'ları ve blokları birleştirilmiş listede yeniden sırala
                            const newAllItems = [...allItems];
                            const draggedItemIndex = newAllItems.findIndex(item => 
                              draggedType === "hero" && draggedBlock.startsWith("hero-") 
                                ? item.type === "hero" && item.id === draggedBlock.replace("hero-", "")
                                : item.type === "block" && item.id === draggedBlock
                            );
                            
                            if (draggedItemIndex === -1 || draggedItemIndex === itemIndex) {
                              setDraggedBlock(null);
                              return;
                            }
                            
                            // Item'ı yeni pozisyona taşı
                            const [removed] = newAllItems.splice(draggedItemIndex, 1);
                            newAllItems.splice(itemIndex, 0, removed);
                            
                            // Yeni order'ları təyin et
                            const heroOrders = [];
                            const blockOrders = [];
                            
                            newAllItems.forEach((item, index) => {
                              if (item.type === "hero") {
                                heroOrders.push({
                                  heroId: item.id.toString(),
                                  order: index,
                                });
                              } else {
                                blockOrders.push({
                                  blockId: item.id,
                                  order: index,
                                });
                              }
                            });
                            
                            try {
                              // Hero order'larını güncelle
                              if (heroOrders.length > 0) {
                                await updateHeroesOrder(heroOrders).unwrap();
                              }
                              
                              // Block order'larını güncelle
                              if (blockOrders.length > 0 && pageContentId) {
                                await updateBlocksOrder({
                                  pageContentId,
                                  blockOrders,
                                }).unwrap();
                              }
                              
                              Swal.fire({
                                title: "Uğurlu!",
                                text: "Sıra yeniləndi",
                                icon: "success",
                                confirmButtonColor: "#5C4977",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                              
                              refetchHeroes();
                              refetch();
                            } catch (error) {
                              console.error("Update order error:", error);
                              Swal.fire({
                                title: "Xəta!",
                                text: error?.data?.error || error?.data?.message || error?.message || "Sıra yenilənərkən xəta baş verdi",
                                icon: "error",
                                confirmButtonColor: "#5C4977",
                              });
                            }
                            
                            setDraggedBlock(null);
                          }}
                          className={`bg-white rounded-xl border transition-all overflow-hidden ${
                            isUpdatingOrder
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-move"
                          } ${
                            draggedBlock === itemId
                              ? "opacity-50 border-[#5C4977]"
                              : draggedOverIndex === totalIndex
                              ? "border-[#5C4977] border-2 bg-[#5C4977]/5"
                              : "border-gray-200 hover:border-[#5C4977]/30 hover:shadow-md"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="text-gray-400">
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
                                <h3 className="font-semibold text-gray-800 text-lg">
                                  Hero
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleHeroActive(hero._id, hero.isActive)}
                                  disabled={isUpdatingOrder}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    hero.isActive
                                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                  }`}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title={hero.isActive ? "Deaktivləşdir" : "Aktivləşdir"}
                                >
                                  {hero.isActive ? (
                                    <FaToggleOn className="h-5 w-5" />
                                  ) : (
                                    <FaPowerOff className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDuplicateHero(hero)}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Kopyala"
                                >
                                  <FaCopy className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setShowAddBlockModal(false);
                                    navigate(`/admin/edit-hero/${hero._id}`);
                                  }}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Redaktə et"
                                >
                                  <FaEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteHero(hero._id)}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Sil"
                                >
                                  <FaTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Block render
                    if (!isHero && block) {
                      return (
                        <div
                          key={itemId}
                          draggable={!isUpdatingOrder}
                          onDragStart={(e) => {
                            setDraggedBlock(itemId);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/html", itemId);
                            e.dataTransfer.setData("type", "block");
                            e.currentTarget.style.opacity = "0.5";
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = "1";
                            setDraggedBlock(null);
                            setDraggedOverIndex(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            setDraggedOverIndex(totalIndex);
                          }}
                          onDragLeave={handleDragLeave}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setDraggedOverIndex(null);
                            
                            if (!draggedBlock || draggedBlock === itemId) {
                              setDraggedBlock(null);
                              return;
                            }
                            
                            const draggedType = e.dataTransfer.getData("type");
                            
                            // Hero'ları ve blokları birleştirilmiş listede yeniden sırala
                            const newAllItems = [...allItems];
                            const draggedItemIndex = newAllItems.findIndex(item => 
                              draggedType === "hero" && draggedBlock.startsWith("hero-") 
                                ? item.type === "hero" && item.id === draggedBlock.replace("hero-", "")
                                : item.type === "block" && item.id === draggedBlock
                            );
                            
                            if (draggedItemIndex === -1 || draggedItemIndex === itemIndex) {
                              setDraggedBlock(null);
                              return;
                            }
                            
                            // Item'ı yeni pozisyona taşı
                            const [removed] = newAllItems.splice(draggedItemIndex, 1);
                            newAllItems.splice(itemIndex, 0, removed);
                            
                            // Yeni order'ları təyin et
                            const heroOrders = [];
                            const blockOrders = [];
                            
                            newAllItems.forEach((item, index) => {
                              if (item.type === "hero") {
                                heroOrders.push({
                                  heroId: item.id.toString(),
                                  order: index,
                                });
                              } else {
                                blockOrders.push({
                                  blockId: item.id,
                                  order: index,
                                });
                              }
                            });
                            
                            try {
                              // Hero order'larını güncelle
                              if (heroOrders.length > 0) {
                                await updateHeroesOrder(heroOrders).unwrap();
                              }
                              
                              // Block order'larını güncelle
                              if (blockOrders.length > 0 && pageContentId) {
                                await updateBlocksOrder({
                                  pageContentId,
                                  blockOrders,
                                }).unwrap();
                              }
                              
                              Swal.fire({
                                title: "Uğurlu!",
                                text: "Sıra yeniləndi",
                                icon: "success",
                                confirmButtonColor: "#5C4977",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                              
                              refetchHeroes();
                              refetch();
                            } catch (error) {
                              console.error("Update order error:", error);
                              Swal.fire({
                                title: "Xəta!",
                                text: error?.data?.error || error?.data?.message || error?.message || "Sıra yenilənərkən xəta baş verdi",
                                icon: "error",
                                confirmButtonColor: "#5C4977",
                              });
                            }
                            
                            setDraggedBlock(null);
                          }}
                          className={`bg-white rounded-xl border transition-all overflow-hidden ${
                            isUpdatingOrder
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-move"
                          } ${
                            draggedBlock === itemId
                              ? "opacity-50 border-[#5C4977]"
                              : draggedOverIndex === totalIndex
                              ? "border-[#5C4977] border-2 bg-[#5C4977]/5"
                              : "border-gray-200 hover:border-[#5C4977]/30 hover:shadow-md"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
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
                                <h3 className="font-semibold text-gray-800 text-lg">
                                  {getBlockTypeLabel(block.type)}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleBlockActive(block._id, block.isActive)}
                                  disabled={isUpdatingOrder}
                                  className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    block.isActive
                                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                  }`}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title={block.isActive ? "Deaktivləşdir" : "Aktivləşdir"}
                                >
                                  {block.isActive ? (
                                    <FaToggleOn className="h-5 w-5" />
                                  ) : (
                                    <FaPowerOff className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDuplicateBlock(block)}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Kopyala"
                                >
                                  <FaCopy className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleEditBlock(block)}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Redaktə et"
                                >
                                  <FaEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlock(block._id)}
                                  disabled={isUpdatingOrder}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Sil"
                                >
                                  <FaTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                </>
              )}
            </div>
          </div>

          {/* Add/Edit Block Modal */}
          {showAddBlockModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
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

                <div className="p-6 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(95vh - 120px)' }}>
                  {!selectedBlockType ? (
                    <div className="space-y-4 pb-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Blok Tipini Seçin
                      </h3>
                      <div className="space-y-4">
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
                          onClick={() => setSelectedBlockType("Products")}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                        >
                          <h4 className="font-semibold text-gray-800">
                            Məhsullar
                          </h4>
                          <p className="text-sm text-gray-500">
                            Məhsullar bloku (Ən Yaxşı Təkliflər, Yeni Məhsullar, Home Appliances birleşimi)
                          </p>
                        </button>
                        <button
                          onClick={() => setSelectedBlockType("ShoppingEvent")}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                        >
                          <h4 className="font-semibold text-gray-800">
                            Shopping Event
                          </h4>
                          <p className="text-sm text-gray-500">
                            Shopping event bloku
                          </p>
                        </button>
                        <button
                          onClick={() => setSelectedBlockType("Accessories")}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer"
                        >
                          <h4 className="font-semibold text-gray-800">
                            Accessories
                          </h4>
                          <p className="text-sm text-gray-500">
                            Accessories bloku
                          </p>
                        </button>
                        <button
                          onClick={() => setSelectedBlockType("Blogs")}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer bg-white"
                          style={{ zIndex: 1 }}
                        >
                          <h4 className="font-semibold text-gray-800">
                            Blogs
                          </h4>
                          <p className="text-sm text-gray-500">
                            Blog seçimi bloku
                          </p>
                        </button>
                        <button
                          onClick={() => setSelectedBlockType("About")}
                          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#5C4977] transition-all text-left cursor-pointer bg-white"
                          style={{ zIndex: 1 }}
                        >
                          <h4 className="font-semibold text-gray-800">
                            About
                          </h4>
                          <p className="text-sm text-gray-500">
                            About bloku
                          </p>
                        </button>
                      </div>
                    </div>
                  ) : selectedBlockType === "ShoppingEvent" ? (
                    <div className="space-y-6">
                      <AdminShoppingEvent 
                        withoutLayout={true}
                        onClose={async () => {
                          // After ShoppingEvent form is submitted, add the block to page content
                          if (pageContentId) {
                            try {
                              const formData = new FormData();
                              formData.append("pageType", "home");
                              formData.append("blockType", "ShoppingEvent");

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

                              setShowAddBlockModal(false);
                              setEditingBlock(null);
                              setSelectedBlockType("");
                              resetForm();
                              refetch();
                            } catch (error) {
                              console.error("Save ShoppingEvent block error:", error);
                            }
                          } else {
                            setShowAddBlockModal(false);
                            setSelectedBlockType("");
                            resetForm();
                          }
                        }}
                      />
                    </div>
                  ) : selectedBlockType === "DefaultSlider" ? (
                    <div className="space-y-6">
                      {/* DefaultSlider seçildiğinde direkt hero ekleme formunu göster */}
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Hero ekleme formu açılıyor...</p>
                      </div>
                    </div>
                  ) : selectedBlockType === "Products" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Məhsullar Məlumatları
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={productsBlockData.title}
                          onChange={(e) =>
                            setProductsBlockData({
                              ...productsBlockData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Məhsullar"
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
                                  const isSelected = productsBlockData.selectedProducts.includes(
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
                                            setProductsBlockData({
                                              ...productsBlockData,
                                              selectedProducts: productsBlockData.selectedProducts.filter(
                                                (id) => id !== product._id
                                              ),
                                            });
                                          } else {
                                            setProductsBlockData({
                                              ...productsBlockData,
                                              selectedProducts: [
                                                ...productsBlockData.selectedProducts,
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
                        {productsBlockData.selectedProducts.length > 0 && (
                          <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş məhsul sayı: {productsBlockData.selectedProducts.length}
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
                          value={productsBlockData.moreProductsLink || ""}
                          onChange={(e) =>
                            setProductsBlockData({
                              ...productsBlockData,
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
                          value={productsBlockData.moreProductsButtonText ?? ""}
                          onChange={(e) =>
                            setProductsBlockData({
                              ...productsBlockData,
                              moreProductsButtonText: e.target.value,
                            })
                          }
                          placeholder="More Products (boş buraxsanız, default 'More Products' istifadə olunacaq)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Button üzərində görünəcək mətn. Boş buraxsanız, "More Products" istifadə olunacaq.
                        </p>
                      </div>

                      {/* Banner Section (Optional) */}
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                          Banner Məlumatları (İstəyə bağlı)
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

                                const maxSize = 5 * 1024 * 1024; // 5MB
                                if (file.size > maxSize) {
                                  Swal.fire({
                                    title: "Xəta!",
                                    text: "Şəkil çox böyükdür. Maksimum ölçü: 5MB",
                                    icon: "error",
                                    confirmButtonColor: "#5C4977",
                                  });
                                  e.target.value = "";
                                  return;
                                }

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

                                        const outputType = 'image/jpeg';
                                        canvas.toBlob(
                                          (blob) => {
                                            if (!blob) {
                                              reject(new Error("Blob yaradılmadı"));
                                              return;
                                            }
                                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                              type: outputType,
                                              lastModified: Date.now(),
                                            });
                                            resolve(compressedFile);
                                          },
                                          outputType,
                                          quality
                                        );
                                      };
                                      img.onerror = () => reject(new Error("Şəkil yüklənmədi"));
                                    };
                                    reader.onerror = () => reject(new Error("Fayl oxunmadı"));
                                  });
                                };

                                try {
                                  let compressedFile = await compressImage(file, 800, 600, 0.6);
                                  const targetSize = 1 * 1024 * 1024; // 1MB
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 600, 400, 0.5);
                                  }
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 400, 300, 0.4);
                                  }

                                  const preview = URL.createObjectURL(compressedFile);
                                  setProductsBlockData({
                                    ...productsBlockData,
                                    banner: {
                                      ...productsBlockData.banner,
                                      image: compressedFile,
                                      imagePreview: preview,
                                    },
                                  });
                                } catch (error) {
                                  console.error("Image compression error:", error);
                                  Swal.fire({
                                    title: "Xəta!",
                                    text: "Şəkil işlənərkən xəta baş verdi",
                                    icon: "error",
                                    confirmButtonColor: "#5C4977",
                                  });
                                }
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            {productsBlockData.banner?.imagePreview && (
                              <div className="mt-4">
                                <img
                                  src={productsBlockData.banner.imagePreview}
                                  alt="Banner preview"
                                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductsBlockData({
                                      ...productsBlockData,
                                      banner: {
                                        ...productsBlockData.banner,
                                        image: null,
                                        imagePreview: null,
                                      },
                                    });
                                  }}
                                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                                >
                                  Şəkli sil
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Banner Subtitle */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Alt Başlıq
                            </label>
                            <input
                              type="text"
                              value={productsBlockData.banner?.subtitle || ""}
                              onChange={(e) =>
                                setProductsBlockData({
                                  ...productsBlockData,
                                  banner: {
                                    ...productsBlockData.banner,
                                    subtitle: e.target.value,
                                  },
                                })
                              }
                              placeholder="Banner alt başlıq"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Banner Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Başlıq
                            </label>
                            <input
                              type="text"
                              value={productsBlockData.banner?.title || ""}
                              onChange={(e) =>
                                setProductsBlockData({
                                  ...productsBlockData,
                                  banner: {
                                    ...productsBlockData.banner,
                                    title: e.target.value,
                                  },
                                })
                              }
                              placeholder="Banner başlıq"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Banner Button Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Button Mətni
                            </label>
                            <input
                              type="text"
                              value={productsBlockData.banner?.buttonText || ""}
                              onChange={(e) =>
                                setProductsBlockData({
                                  ...productsBlockData,
                                  banner: {
                                    ...productsBlockData.banner,
                                    buttonText: e.target.value,
                                  },
                                })
                              }
                              placeholder="Button mətni"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>

                          {/* Banner Button Link */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Button Linki
                            </label>
                            <input
                              type="text"
                              value={productsBlockData.banner?.buttonLink || ""}
                              onChange={(e) =>
                                setProductsBlockData({
                                  ...productsBlockData,
                                  banner: {
                                    ...productsBlockData.banner,
                                    buttonLink: e.target.value,
                                  },
                                })
                              }
                              placeholder="/products veya https://example.com"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Badge Məlumatları (İstəyə bağlı) */}
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                          Badge Məlumatları (İstəyə bağlı)
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Badge Yazısı */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Badge Yazısı
                            </label>
                            <input
                              type="text"
                              value={productsBlockData.badgeText || ""}
                              onChange={(e) =>
                                setProductsBlockData({
                                  ...productsBlockData,
                                  badgeText: e.target.value,
                                })
                              }
                              placeholder="Məsələn: Yeni, Endirim, Hot və s."
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Badge yazısı seçilmiş məhsulların üzərində görünəcək
                            </p>
                          </div>

                          {/* Badge Rəngi */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Badge Rəngi
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="color"
                                value={productsBlockData.badgeColor || "#FF0000"}
                                onChange={(e) =>
                                  setProductsBlockData({
                                    ...productsBlockData,
                                    badgeColor: e.target.value,
                                  })
                                }
                                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                              />
                              <input
                                type="text"
                                value={productsBlockData.badgeColor || "#FF0000"}
                                onChange={(e) =>
                                  setProductsBlockData({
                                    ...productsBlockData,
                                    badgeColor: e.target.value,
                                  })
                                }
                                placeholder="#FF0000"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Badge rəngi seçin (RGB hex formatında)
                            </p>
                          </div>

                          {/* Badge Preview */}
                          {productsBlockData.badgeText && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Badge Önizləmə:</p>
                              <div className="inline-block">
                                <span
                                  className="px-3 py-1 rounded text-sm font-semibold text-white"
                                  style={{ backgroundColor: productsBlockData.badgeColor || "#FF0000" }}
                                >
                                  {productsBlockData.badgeText}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                          value={bestOffersData.moreProductsButtonText ?? ""}
                          onChange={(e) =>
                            setBestOffersData({
                              ...bestOffersData,
                              moreProductsButtonText: e.target.value,
                            })
                          }
                          placeholder="More Products (boş buraxsanız, default 'More Products' istifadə olunacaq)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Button üzərində görünəcək mətn. Boş buraxsanız, "More Products" istifadə olunacaq.
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

                                        // JPEG formatına çevir (daha kiçik ölçü)
                                        const outputType = 'image/jpeg';
                                        canvas.toBlob(
                                          (blob) => {
                                            if (!blob) {
                                              reject(new Error("Blob yaradılmadı"));
                                              return;
                                            }
                                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                              type: outputType,
                                              lastModified: Date.now(),
                                            });
                                            resolve(compressedFile);
                                          },
                                          outputType,
                                          quality
                                        );
                                      };
                                      img.onerror = () => reject(new Error("Şəkil yüklənmədi"));
                                    };
                                    reader.onerror = () => reject(new Error("Fayl oxunmadı"));
                                  });
                                };

                                try {
                                  // Daha aqressiv kompress - daha kiçik ölçü ilə başla
                                  let compressedFile = await compressImage(file, 800, 600, 0.6);
                                  
                                  // Əgər hələ də böyükdürsə, daha çox kompress et
                                  const targetSize = 1 * 1024 * 1024; // 1MB (daha kiçik limit)
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 600, 400, 0.5);
                                  }
                                  
                                  // Final yoxlama - ən kiçik ölçü
                                  if (compressedFile.size > targetSize) {
                                    compressedFile = await compressImage(file, 400, 300, 0.4);
                                  }

                                  // Final yoxlama - əgər hələ də böyükdürsə, xəbərdarlıq göster
                                  if (compressedFile.size > targetSize) {
                                    console.warn("Şəkil hələ də böyükdür:", compressedFile.size, "bytes");
                                    Swal.fire({
                                      title: "Xəbərdarlıq!",
                                      text: `Şəkil ölçüsü ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB-dır. Daha kiçik şəkil seçməyi tövsiyə edirik.`,
                                      icon: "warning",
                                      confirmButtonColor: "#5C4977",
                                    });
                                  }

                                  console.log("Kompress edilmiş şəkil ölçüsü:", compressedFile.size, "bytes", `(${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);

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
                          value={newGoodsData.moreProductsButtonText ?? ""}
                          onChange={(e) =>
                            setNewGoodsData({
                              ...newGoodsData,
                              moreProductsButtonText: e.target.value,
                            })
                          }
                          placeholder="More Products (boş buraxsanız, default 'More Products' istifadə olunacaq)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Button üzərində görünəcək mətn. Boş buraxsanız, "More Products" istifadə olunacaq.
                        </p>
                      </div>
                    </div>
                  ) : selectedBlockType === "HomeAppliances" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Home Appliances Məlumatları
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={homeAppliancesFormData.title}
                          onChange={(e) =>
                            setHomeAppliancesFormData({
                              ...homeAppliancesFormData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Home Appliance"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hot Etiketi *
                        </label>
                        <input
                          type="text"
                          value={homeAppliancesFormData.hotLabel}
                          onChange={(e) =>
                            setHomeAppliancesFormData({
                              ...homeAppliancesFormData,
                              hotLabel: e.target.value,
                            })
                          }
                          placeholder="Hot"
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
                            value={homeAppliancesSearchTerm}
                            onChange={(e) => setHomeAppliancesSearchTerm(e.target.value)}
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
                                  if (!homeAppliancesSearchTerm) return true;
                                  const searchLower = homeAppliancesSearchTerm.toLowerCase();
                                  return (
                                    product.name?.toLowerCase().includes(searchLower) ||
                                    product.brand?.toLowerCase().includes(searchLower) ||
                                    product.model?.toLowerCase().includes(searchLower)
                                  );
                                })
                                .map((product) => {
                                  const isSelected = homeAppliancesFormData.selectedProductIds.includes(
                                    product._id.toString()
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
                                          const productIdStr = product._id.toString();
                                          if (isSelected) {
                                            setHomeAppliancesFormData({
                                              ...homeAppliancesFormData,
                                              selectedProductIds: homeAppliancesFormData.selectedProductIds.filter(
                                                (id) => id !== productIdStr
                                              ),
                                            });
                                          } else {
                                            setHomeAppliancesFormData({
                                              ...homeAppliancesFormData,
                                              selectedProductIds: [
                                                ...homeAppliancesFormData.selectedProductIds,
                                                productIdStr,
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
                        {homeAppliancesFormData.selectedProductIds.length > 0 && (
                          <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş məhsul sayı: {homeAppliancesFormData.selectedProductIds.length}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="homeAppliancesIsActive"
                          checked={homeAppliancesFormData.isActive}
                          onChange={(e) =>
                            setHomeAppliancesFormData({
                              ...homeAppliancesFormData,
                              isActive: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                        />
                        <label htmlFor="homeAppliancesIsActive" className="text-sm font-medium text-gray-700">
                          Aktiv olsun
                        </label>
                      </div>
                    </div>
                  ) : selectedBlockType === "Accessories" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Accessories Məlumatları
                      </h3>
                      
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={accessoryData.title}
                          onChange={(e) =>
                            setAccessoryData({
                              ...accessoryData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Microsoft Accessories"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Təsvir
                        </label>
                        <textarea
                          value={accessoryData.description}
                          onChange={(e) =>
                            setAccessoryData({
                              ...accessoryData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Personalize your Surface Pro with Microsoft branded accessories..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          rows="3"
                        />
                      </div>

                      {/* Hero Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Şəkli
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleHeroImageChange(e.target.files[0]);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        {accessoryData.heroImagePreview && (
                          <div className="mt-2">
                            <img
                              src={accessoryData.heroImagePreview}
                              alt="Hero preview"
                              className="w-48 h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      {/* Categories Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kateqoriyaları Seçin
                        </label>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                          {categories.length === 0 ? (
                            <p className="text-gray-500">Kateqoriya yoxdur</p>
                          ) : (
                            <div className="space-y-2">
                              {categories.map((category) => {
                                const isSelected = accessoryData.selectedCategories.includes(
                                  category._id?.toString() || category._id
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
                                        handleAccessoryCategoryToggle(category._id)
                                      }
                                      className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                                    />
                                    <span>{category.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {accessoryData.selectedCategories.length > 0 && (
                          <div className="mt-2 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş kateqoriya sayı: {accessoryData.selectedCategories.length}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Cards */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kartlar (3 kart)
                        </label>
                        <div className="space-y-4">
                          {accessoryData.cards.map((card, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Kart {index + 1}
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Başlıq
                                  </label>
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) =>
                                      handleCardChange(index, "title", e.target.value)
                                    }
                                    placeholder="Xiaomi MI 11"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Təsvir
                                  </label>
                                  <input
                                    type="text"
                                    value={card.description}
                                    onChange={(e) =>
                                      handleCardChange(index, "description", e.target.value)
                                    }
                                    placeholder="Discount up to 30%"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arxa Plan Şəkli
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleCardImageChange(index, e.target.files[0]);
                                      }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  />
                                  {card.backgroundImagePreview && (
                                    <div className="mt-2">
                                      <img
                                        src={card.backgroundImagePreview}
                                        alt={`Card ${index + 1} preview`}
                                        className="w-32 h-32 object-cover rounded-lg"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Düymə Mətni
                                  </label>
                                  <input
                                    type="text"
                                    value={card.buttonText}
                                    onChange={(e) =>
                                      handleCardChange(index, "buttonText", e.target.value)
                                    }
                                    placeholder="View Details"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Düymə Linki
                                  </label>
                                  <input
                                    type="text"
                                    value={card.buttonLink}
                                    onChange={(e) =>
                                      handleCardChange(index, "buttonLink", e.target.value)
                                    }
                                    placeholder="/products/xiaomi-mi-11"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : selectedBlockType === "Blogs" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Blogs Məlumatları
                      </h3>
                      
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={blogData.title}
                          onChange={(e) =>
                            setBlogData({
                              ...blogData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Məqalələrimiz"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>

                      {/* Blog Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Görünən Bloqlar
                        </label>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={blogSearchTerm}
                            onChange={(e) => setBlogSearchTerm(e.target.value)}
                            placeholder="Blog axtar..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                          {allBlogs.length === 0 ? (
                            <p className="text-gray-500">Blog yoxdur</p>
                          ) : (
                            <div className="space-y-2">
                              {allBlogs
                                .filter((blog) => {
                                  if (!blogSearchTerm) return true;
                                  const searchLower = blogSearchTerm.toLowerCase();
                                  return (
                                    blog.title?.toLowerCase().includes(searchLower) ||
                                    blog.shortContent?.toLowerCase().includes(searchLower) ||
                                    blog.content?.toLowerCase().includes(searchLower)
                                  );
                                })
                                .map((blog) => {
                                  const isSelected = blogData.selectedBlogs.includes(
                                    blog._id?.toString() || blog._id
                                  );
                                  return (
                                    <label
                                      key={blog._id}
                                      className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleBlogToggle(blog._id)}
                                        className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977]"
                                      />
                                      <div className="flex items-center gap-3 flex-1">
                                        {blog.images?.[0]?.url && (
                                          <img
                                            src={blog.images[0].url}
                                            alt={blog.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src =
                                                "https://placehold.co/64x64/6B7280/ffffff?text=No+Image";
                                            }}
                                          />
                                        )}
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800">
                                            {blog.title}
                                          </p>
                                          <p className="text-sm text-gray-500 line-clamp-1">
                                            {blog.shortContent || blog.content?.substring(0, 100) || ""}
                                          </p>
                                          {blog.date && (
                                            <p className="text-xs text-gray-400 mt-1">
                                              {new Date(blog.date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </label>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                        {blogData.selectedBlogs.length > 0 && (
                          <div className="mt-4 p-3 bg-[#5C4977]/10 rounded-lg">
                            <p className="text-sm font-medium text-[#5C4977]">
                              Seçilmiş blog sayı: {blogData.selectedBlogs.length}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : selectedBlockType === "About" ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        About Məlumatları
                      </h3>
                      
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlıq *
                        </label>
                        <input
                          type="text"
                          value={aboutData.title}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              title: e.target.value,
                            })
                          }
                          placeholder="Online store of household appliances and electronics"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Təsvir *
                        </label>
                        <textarea
                          value={aboutData.description}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Then the question arises: where's the content?..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          rows="6"
                          required
                        />
                      </div>

                      {/* Button Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Düymə Mətni
                        </label>
                        <input
                          type="text"
                          value={aboutData.buttonText}
                          onChange={(e) =>
                            setAboutData({
                              ...aboutData,
                              buttonText: e.target.value,
                            })
                          }
                          placeholder="Read More"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
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

                  {(selectedBlockType === "Categories" || selectedBlockType === "Products" || selectedBlockType === "BestOffers" || selectedBlockType === "NewGoods" || selectedBlockType === "HomeAppliances" || selectedBlockType === "Accessories" || selectedBlockType === "Blogs" || selectedBlockType === "About") && (
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
                        disabled={isAdding || isUpdating || isUpdatingHomeAppliances}
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
                        // Eğer blok ekleme modalı açıksa ve DefaultSlider seçildiyse, blok ekleme modalını da kapat
                        if (showAddBlockModal && selectedBlockType === "DefaultSlider") {
                          setShowAddBlockModal(false);
                          setSelectedBlockType("");
                        }
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateHero} className="p-6 space-y-8" encType="multipart/form-data">
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
                        // Eğer blok ekleme modalı açıksa ve DefaultSlider seçildiyse, blok ekleme modalını da kapat
                        if (showAddBlockModal && selectedBlockType === "DefaultSlider") {
                          setShowAddBlockModal(false);
                          setSelectedBlockType("");
                        }
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

