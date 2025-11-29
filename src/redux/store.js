import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import { blogApi } from "./api/blogApi";  // Yeni blogApi import edilir
import userSlice from "./features/userSlice"; // userSlice import edildi

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer, // productApi reducer əlavə edildi
    [authApi.reducerPath]: authApi.reducer, // authApi reducer əlavə edildi
    [blogApi.reducerPath]: blogApi.reducer, // blogApi reducer əlavə edildi
    userSlice: userSlice, // userSlice reducer əlavə edildi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      blogApi.middleware,  // blogApi middleware əlavə edildi
    ]), 
});
