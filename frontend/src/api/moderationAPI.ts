import type { RoleEnum } from "@/interfaces"
import { api } from "@/api"


export const moderationAPI = api.injectEndpoints({
    endpoints: (builder) => ({
         textModeration: builder.mutation<any, string>({
            query: (text: string) => ({
                url: `/moderation/text`,    
                method: 'POST',
                mode: "cors",
                body: {text}
            }),
        }),

        changeRole: builder.mutation<any, RoleEnum>({
            query: (role: RoleEnum) => ({
                url: `/api/role/${role}`,    
                method: 'PATCH',
                mode: "cors",
            }),
        }),

    })
})

export const { useChangeRoleMutation, useTextModerationMutation  } = moderationAPI