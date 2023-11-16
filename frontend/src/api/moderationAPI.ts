import type { RoleEnum } from "@/interfaces";
import { api } from "@/api";

export const moderationAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    textModeration: builder.mutation<any, string>({
      query: (text: string) => ({
        url: `/moderation/text`,
        method: "POST",
        mode: "cors",
        body: { text },
      }),
    }),
    imageModeration: builder.mutation<any, FormData>({
      query: (body: FormData) => ({
        url: `/moderation/image`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        mode: "cors",
        body: body,
      }),
    }),
    audioModeration: builder.mutation<any, FormData>({
      query: (body: FormData) => ({
        url: `/moderation/audio`,
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
        mode: "cors",
        body: body,
      }),
    }),
    videoModeration: builder.mutation<any, FormData>({
      query: (body: FormData) => ({
        url: `/moderation/video`,
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
        mode: "cors",
        body: body,
      }),
    }),

    changeRole: builder.mutation<any, RoleEnum>({
      query: (role: RoleEnum) => ({
        url: `/api/role/${role}`,
        method: "PATCH",
        mode: "cors",
      }),
    }),
  }),
});

export const {
  useChangeRoleMutation,
  useTextModerationMutation,
  useAudioModerationMutation,
  useImageModerationMutation,
  useVideoModerationMutation,
} = moderationAPI;
