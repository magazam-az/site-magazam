import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Units"],
  endpoints: (builder) => ({
    getUnits: builder.query({
      query: () => "/units",
      providesTags: ["Units"],
    }),
    getUnit: builder.query({
      query: (id) => `/units/${id}`,
      providesTags: ["Units"],
    }),
    createUnit: builder.mutation({
      query: (data) => ({
        url: "/admin/units",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Units"],
    }),
    updateUnit: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Units"],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/admin/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Units"],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useGetUnitQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;

