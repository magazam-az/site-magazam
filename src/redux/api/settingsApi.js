import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    // Settings məlumatlarını gətirir
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    // Settings məlumatlarını yeniləyir (admin)
    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: "/admin/settings",
        method: "PUT",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;


