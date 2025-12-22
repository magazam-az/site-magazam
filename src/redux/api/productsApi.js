import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  tagTypes: ["Products", "Cart"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/admin/products",
        method: "POST",
        body: productData,
        // ✅ RTK Query FormData-nı avtomatik olaraq tanıyır və Content-Type header-ını düzgün təyin edir
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    editProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: formData,
        // ✅ RTK Query FormData-nı avtomatik olaraq tanıyır və Content-Type header-ını düzgün təyin edir
      }),
      invalidatesTags: ["Products"],
    }),
    getCart: builder.query({
      query: () => "/products/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/products/cart",
        method: "POST",
        body: { productId, quantity },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/products/cart/update/${productId}`,
        method: "PUT",
        body: { quantity },
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          productApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (draft?.cart) {
              const item = draft.cart.find(item => item.product?._id === productId);
              if (item) {
                item.quantity = quantity;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Revert on error
          patchResult.undo();
        }
      },
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/products/cart/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    getFavorites: builder.query({
      query: () => ({
        url: "/products/favorites",
        credentials: "include",
      }),
      providesTags: ["Favorites"],
      transformResponse: (response) => ({
        favorites: response?.favorites || [],
      }),
    }),
    addToFavorites: builder.mutation({
      query: (productId) => ({
        url: "/products/favorites",
        method: "POST",
        body: { productId },
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFromFavorites: builder.mutation({
      query: (productId) => ({
        url: `/products/favorites/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData("getFavorites", undefined, (draft) => {
              draft.favorites = draft.favorites.filter(
                (favorite) => favorite._id !== productId
              );
            })
          );
        } catch {
          // No additional action is needed if mutation fails
        }
      },
    }),
    searchProducts: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/products/search",
        params: { query, page, limit },
      }),
    }),
    // Yeni filter endpoint‑i
    filterProducts: builder.query({
      query: (filters) => ({
        url: "/products/filter",
        params: filters,
      }),
    }), 

    createOrUpdateReview: builder.mutation({
      query: (reviewData) => ({
        url: "/products/review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Products"],
    }),
        getProductReviews: builder.query({
          query: (id) => `/products/${id}/reviews`,
          providesTags: ["Reviews"],
        }), 
  }),
});

// Yaratılan hook‑ları ixrac edirik, filter endpoint‑i üçün "useFilterProductsQuery" hook‑u yaranacaq.
export const {
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useGetFavoritesQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCartQuery,
  useSearchProductsQuery,
  useCreateOrUpdateReviewMutation, useGetProductReviewsQuery ,
  useFilterProductsQuery, // Hook for filtering products
} = productApi;