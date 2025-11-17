import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, logout} from "../features/userSlice";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: "/crud/v1", credentials:'include'}),
    endpoints: (builder) => ({
        register: builder.mutation({
            query(body){
                return{
                    url: "/register",
                    method: "POST",
                    body,
                }
            },
            async onQueryStarted(args, {dispatch, queryFulfilled}){
               try{
                const {data} = await queryFulfilled
                dispatch(setUser(data))
                dispatch(setIsAuthenticated(true))
               }

               catch(err){

               }
            }
        }),
        login: builder.mutation({
            query(body){
                return{
                    url: "/login",
                    method:"POST",
                    body,
                }
            },
            async onQueryStarted(args, {dispatch, queryFulfilled}){
                try{
                    const {data} = await queryFulfilled
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                }

                catch(err){

                }
            }
        }),
        logout: builder.query({
            query:()=>"/logout"
        }),
        resetPassword: builder.mutation({
          query: ({ token, password, confirmPassword }) => ({
            url: `/password/reset/${token}`,
            method: "PUT",
            body: { password, confirmPassword },
          }),
        }),
        
          forgotPassword: builder.mutation({
            query: (body) => {
              console.log("Sending forgot password request", body)
              return {
                url: "/password/forgot",
                method: "POST",
                body,
              }
            },
            async onQueryStarted(arg, { queryFulfilled }) {
              try {
                const result = await queryFulfilled
                console.log("Forgot password request successful", result)
              } catch (error) {
                console.error("Forgot password request failed", error)
              }
            },
          }),
    })
        
})


export const {useRegisterMutation, useLoginMutation, useLazyLogoutQuery, useForgotPasswordMutation, useResetPasswordMutation} = authApi


            