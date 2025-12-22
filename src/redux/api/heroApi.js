import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const heroApi = createApi({
  reducerPath: "heroApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Hero"],
  endpoints: (builder) => ({
    // Aktiv hero-nu gətirir
    getHero: builder.query({
      query: () => "/hero",
      providesTags: ["Hero"],
    }),
    // Bütün hero-ları gətirir (admin üçün)
    getAllHeroes: builder.query({
      query: () => "/admin/heroes",
      providesTags: ["Hero"],
    }),
    // Seçilmiş hero-nu gətirir (admin üçün)
    getHeroById: builder.query({
      query: (id) => `/admin/heroes/${id}`,
      providesTags: ["Hero"],
    }),
    // Yeni hero yaradır
    createHero: builder.mutation({
      query: (heroData) => ({
        url: "/admin/heroes",
        method: "POST",
        body: heroData,
      }),
      invalidatesTags: ["Hero"],
    }),
    // Mövcud hero-nu yeniləyir
    updateHero: builder.mutation({
      query: ({ id, heroData }) => ({
        url: `/admin/heroes/${id}`,
        method: "PUT",
        body: heroData,
      }),
      invalidatesTags: ["Hero"],
    }),
    // Hero-nu silir
    deleteHero: builder.mutation({
      query: (id) => ({
        url: `/admin/heroes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hero"],
    }),
  }),
});

export const {
  useGetHeroQuery,
  useGetAllHeroesQuery,
  useGetHeroByIdQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
} = heroApi;

