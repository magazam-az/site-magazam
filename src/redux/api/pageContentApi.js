import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const pageContentApi = createApi({
  reducerPath: "pageContentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["PageContent"],
  endpoints: (builder) => ({
    // Ana səhifə kontentini gətirir (istifadəçilər üçün)
    getPageContent: builder.query({
      query: (pageType = "home") => `/page-content?pageType=${pageType}`,
      providesTags: ["PageContent"],
    }),
    // Bütün kontentləri gətirir (admin üçün)
    getAllPageContents: builder.query({
      query: () => "/admin/page-contents",
      providesTags: ["PageContent"],
    }),
    // Seçilmiş kontenti gətirir (admin üçün)
    getPageContentById: builder.query({
      query: (id) => `/admin/page-contents/${id}`,
      providesTags: ["PageContent"],
    }),
    // Ana səhifə kontentini gətirir və ya yaradır (admin üçün)
    getOrCreateHomePageContent: builder.query({
      query: () => "/admin/page-contents/home/get-or-create",
      providesTags: ["PageContent"],
    }),
    // Blok əlavə edir
    addBlock: builder.mutation({
      query: ({ pageContentId, formData }) => ({
        url: `/admin/page-contents/${pageContentId}/blocks`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PageContent"],
    }),
    // Bloku yeniləyir
    updateBlock: builder.mutation({
      query: ({ pageContentId, blockId, formData }) => ({
        url: `/admin/page-contents/${pageContentId}/blocks/${blockId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["PageContent"],
    }),
    // Bloku silir
    deleteBlock: builder.mutation({
      query: ({ pageContentId, blockId }) => ({
        url: `/admin/page-contents/${pageContentId}/blocks/${blockId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PageContent"],
    }),
    // Blokların sırasını yeniləyir
    updateBlocksOrder: builder.mutation({
      query: ({ pageContentId, blockOrders }) => ({
        url: `/admin/page-contents/${pageContentId}/blocks-order`,
        method: "PUT",
        body: { blockOrders },
      }),
      invalidatesTags: ["PageContent"],
    }),
  }),
});

export const {
  useGetPageContentQuery,
  useGetAllPageContentsQuery,
  useGetPageContentByIdQuery,
  useGetOrCreateHomePageContentQuery,
  useAddBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useUpdateBlocksOrderMutation,
} = pageContentApi;

