import type { RoleEnum } from "@/interfaces"
import { api } from "@/api"

type authResponse = {
    token: {
        type: string,
        token: string
    },
    user:{
        id: string,
        username: string,
        email: string,
        registered_at: Date,
        is_verified: boolean,
        role: RoleEnum,
        api_token: string
    }
}

type loginRequest = {
    login: string, 
    password: string
}

type signupRequest = {
    email: string,
    username: string, 
    password: string
}

export const authAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        verify: builder.query<authResponse, void>({
            query: () => "/auth/verify",
            providesTags: ["auth"]
        }),

        login: builder.mutation<authResponse, loginRequest>({
            query: (data: loginRequest) => ({
                url: "/auth/signin",    
                method: 'POST',
                mode: "cors",
                body: data
            }),
            invalidatesTags: ["auth"]
        }),

        signup: builder.mutation<authResponse, signupRequest>({
            query: (data: signupRequest) => ({
                url: "/auth/signup",    
                method: 'POST',
                mode: "cors",
                body: data
            }),
            invalidatesTags: ["auth"] 
        }),


    })
})

export const { useVerifyQuery, useLoginMutation, useSignupMutation } = authAPI