import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const popularCategoriesApi = createApi({
  reducerPath: "popularCategoriesApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["PopularCategories"],
  endpoints: (builder) => ({
    // Aktiv PopularCategories-ni gətirir
    getPopularCategories: builder.query({
      query: () => "/popular-categories",
      providesTags: ["PopularCategories"],
    }),
    // Bütün PopularCategories-ləri gətirir (admin üçün)
    getAllPopularCategories: builder.query({
      query: () => "/admin/popular-categories",
      providesTags: ["PopularCategories"],
    }),
    // Seçilmiş PopularCategories-ni gətirir (admin üçün)
    getPopularCategoriesById: builder.query({
      query: (id) => `/admin/popular-categories/${id}`,
      providesTags: ["PopularCategories"],
    }),
    // Yeni PopularCategories yaradır
    createPopularCategories: builder.mutation({
      query: (popularCategoriesData) => ({
        url: "/admin/popular-categories",
        method: "POST",
        body: popularCategoriesData,
      }),
      invalidatesTags: ["PopularCategories"],
    }),
    // Mövcud PopularCategories-ni yeniləyir
    updatePopularCategories: builder.mutation({
      query: ({ id, popularCategoriesData }) => ({
        url: `/admin/popular-categories/${id}`,
        method: "PUT",
        body: popularCategoriesData,
      }),
      invalidatesTags: ["PopularCategories"],
    }),
    // PopularCategories-ni silir
    deletePopularCategories: builder.mutation({
      query: (id) => ({
        url: `/admin/popular-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PopularCategories"],
    }),
  }),
});

export const {
  useGetPopularCategoriesQuery,
  useGetAllPopularCategoriesQuery,
  useGetPopularCategoriesByIdQuery,
  useCreatePopularCategoriesMutation,
  useUpdatePopularCategoriesMutation,
  useDeletePopularCategoriesMutation,
} = popularCategoriesApi;

