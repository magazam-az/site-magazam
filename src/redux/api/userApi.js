import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CRUD_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: CRUD_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // Bütün istifadəçiləri gətirir (admin)
    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),
    // Seçilmiş istifadəçinin detallarını gətirir (admin)
    getUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["Users"],
    }),
    // İstifadəçini yeniləyir (admin)
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    // İstifadəçini silir (admin)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;


