import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const promotionApi = createApi({
  reducerPath: "promotionApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Promotions"],
  endpoints: (builder) => ({
    // Bütün promotion-ları gətirir
    getPromotions: builder.query({
      query: () => "/promotions",
      providesTags: ["Promotions"],
    }),
    // Seçilmiş promotion-un detallarını gətirir
    getPromotionDetails: builder.query({
      query: (id) => `/promotions/${id}`,
      providesTags: ["Promotions"],
    }),
    // Yeni promotion yaradır
    createPromotion: builder.mutation({
      query: (promotionData) => ({
        url: "/admin/promotions",
        method: "POST",
        body: promotionData,
      }),
      invalidatesTags: ["Promotions"],
    }),
    // Mövcud promotion-u yeniləyir
    updatePromotion: builder.mutation({
      query: ({ id, promotionData }) => ({
        url: `/admin/promotions/${id}`,
        method: "PUT",
        body: promotionData,
      }),
      invalidatesTags: ["Promotions"],
    }),
    // Promotion-u silir
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/admin/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promotions"],
    }),
  }),
});

export const {
  useGetPromotionsQuery,
  useGetPromotionDetailsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
