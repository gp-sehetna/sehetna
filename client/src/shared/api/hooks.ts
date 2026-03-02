import ky, { AfterResponseHook } from "ky"
import { toast } from "sonner"
import { AppResponseType, BaseErrorResponse } from "../http/response"
import { UnauthorizedException } from "@/shared/http/errors"

const handleErrors: AfterResponseHook = async (_request, _options, response) => {
    // No content to process
    if (response.status === 204) return response

    let data: AppResponseType

    try {
        data = await response.clone().json()
    } catch {
        return response // non-JSON response
    }

    switch (response.status) {
        // Bad request or validation error
        case 400:
        case 422:
            toast.warning(data?.message || "An error occurred. Please try again.")
            break
        // Forbidden
        case 403:
            toast.error(data?.message || "You do not have permission to perform this action.")
            break
        // Not Found
        case 404:
            toast.error(data?.message || "The requested resource was not found.")
            break
        // Conflict
        case 409:
            toast.error(data?.message || "A conflict occurred. Please try again.")
            break
        // Expired
        case 410:
            toast.error(data?.message || "The resource is no longer available or has expired.")
            break
        // Rate Limit Exceeded
        case 429:
            toast.error(data?.message || "Too many requests. Please slow down.")
            // You might want to implement retry logic here
            break
        // Internal Server Error
        case 500:
            toast.error(data?.message || "A server error occurred. Please try again later.")
            break
    }

    return response
}

const handleUnAuthorized: AfterResponseHook = async (request, options, response) => {
    if (response.status !== 401) return response

    const data: BaseErrorResponse = await response.clone().json()

    if (data.cause === "expired") {
        const refreshResponse = await fetch("/api/auth/refresh", { credentials: "include" })
        const refreshData: AppResponseType = await refreshResponse.json()

        if (!refreshData.success && typeof window !== "undefined") {
            window.location.href = refreshData.destination || "/authenticate/login/raw"
            return
        }

        return ky(request, options)
    }

    return response
}

export { handleErrors, handleUnAuthorized }
