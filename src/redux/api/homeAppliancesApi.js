import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const homeAppliancesApi = createApi({
  reducerPath: "homeAppliancesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["HomeAppliances"],
  endpoints: (builder) => ({
    // Public: HomeAppliances gətir (frontend üçün)
    getHomeAppliances: builder.query({
      query: () => "/home-appliances",
      providesTags: ["HomeAppliances"],
    }),
    // Admin: HomeAppliances gətir
    getHomeAppliancesAdmin: builder.query({
      query: () => "/admin/home-appliances",
      providesTags: ["HomeAppliances"],
    }),
    // Admin: HomeAppliances yenilə
    updateHomeAppliances: builder.mutation({
      query: (data) => ({
        url: "/admin/home-appliances",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HomeAppliances"],
    }),
  }),
});

export const {
  useGetHomeAppliancesQuery,
  useGetHomeAppliancesAdminQuery,
  useUpdateHomeAppliancesMutation,
} = homeAppliancesApi;
