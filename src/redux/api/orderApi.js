import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Orders", "Cart"],
  endpoints: (builder) => ({
    // Yeni sifariş yarat
    createOrder: builder.mutation({
      query: (orderData) => {
        console.log('[DEBUG] 🔵 [orderApi] createOrder mutation çağırıldı', {
          url: "/order/new",
          method: "POST",
          orderData,
        });
        return {
          url: "/order/new",
          method: "POST",
          body: orderData,
          credentials: "include",
        };
      },
      invalidatesTags: ["Orders", "Cart"],
    }),
    // İstifadəçinin sifarişləri
    getMyOrders: builder.query({
      query: () => "/order/me",
      providesTags: ["Orders"],
    }),
    // Tək sifariş
    getOrderDetails: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Orders"],
    }),
    // Admin - bütün sifarişlər
    getAllOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["Orders"],
    }),
    // Admin - sifariş statusunu yenilə
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/order/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    // Admin - sifarişi sil
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;

