import { AppResponseType, BaseErrorResponse } from "@/shared/http/response"
import ky, { AfterResponseHook } from "ky"
import { toast } from "sonner"

const RETRY_HEADER = "x-auth-retry"

const jsonOrNull = async <T>(response: Response): Promise<T | null> => {
    try {
        return (await response.clone().json()) as T
    } catch {
        return null
    }
}

const handleErrors: AfterResponseHook = async (_request, _options, response) => {
    // No content to process
    if (response.status === 204) return response

    const data = await jsonOrNull<AppResponseType>(response)
    if (!data) return response

    switch (response.status) {
        case 400:
        case 422:
            toast.warning(data.message || "An error occurred. Please try again.")
            break
        case 403:
            toast.error(data.message || "You do not have permission to perform this action.")
            break
        case 404:
            toast.error(data.message || "The requested resource was not found.")
            break
        case 409:
            toast.error(data.message || "A conflict occurred. Please try again.")
            break
        case 410:
            toast.error(data.message || "The resource is no longer available or has expired.")
            break
        case 429:
            toast.error(data.message || "Too many requests. Please slow down.")
            break
        case 500:
            toast.error(data.message || "A server error occurred. Please try again later.")
            break
    }

    return response
}

const handleUnauthorized: AfterResponseHook = async (request, options, response) => {
    if (response.status !== 401) return response

    const data = await jsonOrNull<BaseErrorResponse>(response)
    if (!data || data.cause !== "expired" || request.headers.get(RETRY_HEADER) === "1")
        return response

    const refreshRes = await ky.get("/api/auth/refresh", {
        credentials: "include",
        throwHttpErrors: false,
    })

    if (refreshRes.ok) {
        const headers = new Headers(request.headers)
        headers.set(RETRY_HEADER, "1")
        return ky(new Request(request, { headers }), options)
    }

    const refreshData = await jsonOrNull<AppResponseType>(refreshRes)
    if (!refreshData?.success && refreshData?.cause === "login-expired")
        toast.info("Login expired, please log in again")

    return response
}

export { handleErrors, handleUnauthorized }
