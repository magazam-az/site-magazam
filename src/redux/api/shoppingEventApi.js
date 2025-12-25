import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const shoppingEventApi = createApi({
  reducerPath: "shoppingEventApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["ShoppingEvent"],
  endpoints: (builder) => ({
    // Public: ShoppingEvent gətir (frontend üçün)
    getShoppingEvent: builder.query({
      query: () => "/shopping-event",
      providesTags: ["ShoppingEvent"],
    }),
    // Admin: ShoppingEvent gətir
    getShoppingEventAdmin: builder.query({
      query: () => "/admin/shopping-event",
      providesTags: ["ShoppingEvent"],
    }),
    // Admin: ShoppingEvent yenilə
    updateShoppingEvent: builder.mutation({
      query: (data) => ({
        url: "/admin/shopping-event",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShoppingEvent"],
    }),
  }),
});

export const {
  useGetShoppingEventQuery,
  useGetShoppingEventAdminQuery,
  useUpdateShoppingEventMutation,
} = shoppingEventApi;

