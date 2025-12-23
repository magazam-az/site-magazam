import React, { useMemo } from "react";
import Container from "./ui/Container";
import { useGetProductsQuery } from "../redux/api/productsApi";
import { useGetCategoriesQuery } from "../redux/api/categoryApi";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const CategoryCard = ({ name, slug, productCount, imageUrl, imageAlt, subcategories = [], categorySlug, customPath, productText = "product" }) => {
  const itemSlug = slug || encodeURIComponent(name);
  const linkPath = customPath || (categorySlug ? `/catalog/${categorySlug}/${itemSlug}` : `/catalog/${itemSlug}`);

  return (
    <div
      className="bg-transparent rounded-xl transition-all duration-300 flex flex-col items-center justify-between p-0 cursor-pointer w-full max-w-[200px] mx-auto group focus:outline-none"
      style={{ minHeight: "200px" }}
    >
      <Link
        to={linkPath}
        className="w-full flex flex-col items-center"
      >
        <div className="w-full aspect-square flex justify-center items-center bg-white">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-contain w-36 h-36 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/150x150/6B7280/ffffff?text=Image+Error";
            }}
          />
        </div>

        <div className="text-center mt-2 sm:mt-4 w-full">
          <h3
            className="font-bold text-gray-800 line-clamp-2"
            style={{ fontSize: "19px" }}
          >
            {name}
          </h3>
          <p
            className={`text-sm mt-1 ${
              productCount > 0 ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {productCount} {productText}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default function DynamicCategories({ categoriesData }) {
  if (!categoriesData) return null;

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery();

  const {
    data: categoriesDataFromApi,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();

  const title = categoriesData.title || "Popular Kateqoriyalar";
  const visibleCategoryIds = useMemo(() => {
    if (!categoriesData.visibleCategories) {
      return new Set();
    }
    return new Set(
      categoriesData.visibleCategories
        .filter((vc) => vc.isVisible !== false)
        .map((vc) => vc.categoryId?._id || vc.categoryId)
    );
  }, [categoriesData]);

  const categories = useMemo(() => {
    const products = productsData?.products || [];
    const apiCategories =
      categoriesDataFromApi?.categories ||
      categoriesDataFromApi?.data ||
      categoriesDataFromApi ||
      [];

    if (!Array.isArray(apiCategories) || apiCategories.length === 0) {
      return [];
    }

    const result = apiCategories
      .filter((cat) => visibleCategoryIds.has(cat._id))
      .map((cat) => {
        const relatedProducts = products.filter(
          (p) =>
            p.category === cat.name ||
            p.categoryId === cat._id
        );

        let imageUrl =
          cat.image?.url ||
          cat.imageUrl ||
          "";

        if (!imageUrl) {
          for (const p of relatedProducts) {
            const url =
              (p.images && p.images.length > 0 && p.images[0]?.url) ||
              p.image ||
              "";
            if (url) {
              imageUrl = url;
              break;
            }
          }
        }

        const subcatsArray = Array.isArray(cat.subcategories)
          ? cat.subcategories
          : [];

        const subcategories = subcatsArray.map((sub) => {
          const subProducts = products.filter(
            (p) =>
              p.category === cat.name &&
              p.subcategory === sub.name
          );

          return {
            _id: sub._id,
            name: sub.name,
            slug: sub.slug,
            productCount: subProducts.length,
          };
        });

        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          productCount: relatedProducts.length,
          imageUrl:
            imageUrl ||
            "https://placehold.co/150x150/6B7280/ffffff?text=No+Image",
          imageAlt: `${cat.name} kateqoriyası`,
          subcategories,
        };
      });

    return result;
  }, [productsData, categoriesDataFromApi, visibleCategoryIds]);

  const isLoading = isProductsLoading || isCategoriesLoading;
  const isError = isProductsError || isCategoriesError;

  if (isLoading) {
    return (
      <Container>
        <div className="w-full py-8 sm:py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
      </Container>
    );
  }

  if (isError || !categories.length) {
    return null;
  }

  return (
    <Container>
      <div className="w-full py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 tracking-tight text-center sm:text-left">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category._id || category.name}
              className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-24px)] xl:w-[calc(16.666%-20px)]"
              style={{ minWidth: "140px", maxWidth: "200px" }}
            >
              <CategoryCard
                name={category.name}
                slug={category.slug}
                productCount={category.productCount}
                imageUrl={category.imageUrl}
                imageAlt={category.imageAlt}
                subcategories={category.subcategories}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

