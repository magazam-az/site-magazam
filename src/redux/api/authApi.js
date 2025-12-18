import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, logout } from "../features/userSlice";
import { CRUD_BASE_URL } from "../../config/api.js";
import { prepareHeaders } from "./prepareHeaders.js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CRUD_BASE_URL,
    credentials: "include",
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/register",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Register işleminde authentication state set edilmemeli
          // Çünkü email doğrulanmadan login olmamış oluyor
          // Token ve user bilgileri sadece login işleminde set edilmeli
        } catch (err) {
          console.error('[DEBUG] ❌ [authApi] Register error:', err);
        }
      },
    }),

    login: builder.mutation({
      query(body) {
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // #region agent log
          const loginLog = {
            location: 'authApi.js:43',
            message: '✅ Login response (onQueryStarted)',
            data: {
              hasToken: !!data?.token,
              tokenLength: data?.token?.length,
              hasUser: !!data?.user,
              userId: data?.user?._id,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
          };
          fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginLog)
          }).catch(() => {});
          console.log('[DEBUG] ✅ [authApi] Login response:', {
            hasToken: !!data?.token,
            tokenLength: data?.token?.length,
            hasUser: !!data?.user
          });
          // #endregion

          // Token-i localStorage-ə yaz
          const token = data?.token || data?.data?.token;
          if (token) {
            localStorage.setItem('token', token.trim());
            // #region agent log
            const storageLog = {
              location: 'authApi.js:65',
              message: '✅ Token localStorage-ə yazıldı',
              data: {
                tokenLength: token?.length,
                tokenPrefix: token?.substring(0, 20) + '...',
                verified: localStorage.getItem('token') === token.trim()
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B'
            };
            fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(storageLog)
            }).catch(() => {});
            console.log('[DEBUG] ✅ [authApi] Token stored:', {
              tokenLength: token?.length,
              verified: localStorage.getItem('token') === token.trim()
            });
            // #endregion
          } else {
            console.error('[DEBUG] ❌ [authApi] NO TOKEN IN RESPONSE!', {
              dataKeys: Object.keys(data || {}),
              data: JSON.stringify(data).substring(0, 200)
            });
          }

          // User məlumatlarını yaz
          if (data?.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          localStorage.setItem('isAuthenticated', 'true');

          dispatch(setUser(data.user));
          dispatch(setIsAuthenticated(true));

        } catch (err) {
          // #region agent log
          const errorLog = {
            location: 'authApi.js:94',
            message: '❌ Login error',
            data: {
              error: err?.message || String(err),
              status: err?.status
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
          };
          fetch('http://127.0.0.1:7242/ingest/49f3303b-3f26-416c-a253-5eeb0b1414d8', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorLog)
          }).catch(() => {});
          console.error('[DEBUG] ❌ [authApi] Login error:', err);
          // #endregion
        }
      },
    }),

    logout: builder.query({
      query: () => "/logout",
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body: { password, confirmPassword },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/password/forgot",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: `/email/verify`,
        method: "POST",
        body, // { email, code }
      }),
    }),

    resendVerificationEmail: builder.mutation({
      query: (body) => ({
        url: "/email/resend-verification",
        method: "POST",
        body,
      }),
    }),

    updateProfile: builder.mutation({
      query: (body) => {
        // Eğer FormData ise (avatar yükleme durumunda)
        if (body instanceof FormData) {
          return {
            url: "/me/update",
            method: "PUT",
            body,
          };
        }
        // Normal JSON body
        return {
          url: "/me/update",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // ⭐ DÜZƏLDİLMİŞ
          dispatch(setUser(data.user));

        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLazyLogoutQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useUpdateProfileMutation,
} = authApi;
