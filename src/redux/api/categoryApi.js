import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ["Categories"],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    addSubcategory: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `/admin/categories/${categoryId}/subcategories`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateSubcategory: builder.mutation({
      query: ({ categoryId, subcategoryId, formData }) => ({
        url: `/admin/categories/${categoryId}/subcategories/${subcategoryId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteSubcategory: builder.mutation({
      query: ({ categoryId, subcategoryId }) => ({
        url: `/admin/categories/${categoryId}/subcategories/${subcategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryApi;

