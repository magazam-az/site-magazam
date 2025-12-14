import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import { blogApi } from "./api/blogApi";  // Yeni blogApi import edilir
import { promotionApi } from "./api/promotionApi";  // Promotion API import edilir
import { categoryApi } from "./api/categoryApi";  // Category API import edilir
import { brandApi } from "./api/brandApi";  // Brand API import edilir
import { specApi } from "./api/specApi";  // Spec API import edilir
import { userApi } from "./api/userApi";  // User API import edilir
import { settingsApi } from "./api/settingsApi";  // Settings API import edilir
import { orderApi } from "./api/orderApi";  // Order API import edilir
import userReducer from "./features/userSlice"; // userSlice default export -> userReducer adı ilə

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer, // productApi reducer əlavə edildi
    [authApi.reducerPath]: authApi.reducer,       // authApi reducer əlavə edildi
    [blogApi.reducerPath]: blogApi.reducer,       // blogApi reducer əlavə edildi
    [promotionApi.reducerPath]: promotionApi.reducer, // promotionApi reducer əlavə edildi
    [categoryApi.reducerPath]: categoryApi.reducer, // categoryApi reducer əlavə edildi
    [brandApi.reducerPath]: brandApi.reducer, // brandApi reducer əlavə edildi
    [specApi.reducerPath]: specApi.reducer, // specApi reducer əlavə edildi
    [userApi.reducerPath]: userApi.reducer, // userApi reducer əlavə edildi
    [settingsApi.reducerPath]: settingsApi.reducer, // settingsApi reducer əlavə edildi
    [orderApi.reducerPath]: orderApi.reducer, // orderApi reducer əlavə edildi
    user: userReducer,                            // ✅ Artıq state.user mövcuddur
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      blogApi.middleware,  // blogApi middleware əlavə edildi
      promotionApi.middleware,  // promotionApi middleware əlavə edildi
      categoryApi.middleware,  // categoryApi middleware əlavə edildi
      brandApi.middleware,  // brandApi middleware əlavə edildi
      specApi.middleware,  // specApi middleware əlavə edildi
      userApi.middleware,  // userApi middleware əlavə edildi
      settingsApi.middleware,  // settingsApi middleware əlavə edildi
      orderApi.middleware,  // orderApi middleware əlavə edildi
    ]),
});
