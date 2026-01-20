import apiClient from "./client"
import { getAccessToken } from "@/lib/auth"

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // global error handling
        if (error.response?.status === 401) {
            // logout / refresh token logic
        }

        return Promise.reject(error)
    }
)
