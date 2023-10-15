import { api } from "@/api"

export const emailAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        sendCode: builder.mutation<any, void>({
            query: () => ({
                url: "/email/request",    
                method: 'POST',
                mode: "cors",
            }),
        }),

        verifyEmail: builder.mutation<any, string>({
            query: (code: string) => ({
                url: `/email/verify?code=${code}`,    
                method: 'PATCH',
                mode: "cors",
            }),
            invalidatesTags: ["auth"]
        })
    })
})

export const { useSendCodeMutation, useVerifyEmailMutation } = emailAPI