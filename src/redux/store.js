import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import userSlice from "./features/userSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    user: userSlice, // 🔥 DEĞİŞTİR: userSlice: userSlice -> user: userSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
    ]), 
});