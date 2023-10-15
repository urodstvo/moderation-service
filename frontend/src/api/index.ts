import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
}

export const api = createApi({
    reducerPath: "api",
    tagTypes: ["auth", "email", "moderation"],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000",
        headers: headers,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set('Authorization', token)
            return headers
          },
    }),
    endpoints: () => ({})
})


