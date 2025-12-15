import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    // Bütün blog yazılarını gətirir
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blogs"],
    }),
    // Seçilmiş blog yazısının detallarını gətirir
    getBlogDetails: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blogs"],
    }),
    // Yeni blog yazısı yaradır
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "/admin/blogs",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blogs"],
    }),
    // Mövcud blog yazısını yeniləyir
    updateBlog: builder.mutation({
      query: ({ id, blogData }) => ({
        url: `/admin/blogs/${id}`,
        method: "PUT",
        body: blogData,
      }),
      invalidatesTags: ["Blogs"],
    }),
    // Blog yazısını silir
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
