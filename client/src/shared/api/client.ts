import { ApiError } from "@/shared/http/errors.client"
import { AppResponseType } from "@/shared/http/response"
import ky, { AfterResponseHook } from "ky"

const handleErrors: AfterResponseHook = async (_request, _options, response) => {
    // Not a response from our API (Route Handlers)
    if (!response.url.endsWith("/api")) return response
    // No content to process
    if (response.status === 204) return response

    let data: AppResponseType

    try {
        data = await response.clone().json()
    } catch {
        return response // non-JSON response
    }

    // Successful response but API says failure
    if (!data.success) throw new ApiError(data.message, response.status, data?.err_details)

    return response
}

const api = ky.create({
    prefixUrl: "/",
    credentials: "include",
    timeout: process.env.NODE_ENV !== "production" ? 10000000 : 20000,
    headers: {
        "Content-Type": "application/json",
    },
    hooks: {
        afterResponse: [handleErrors],
    },
})

export default api
