import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"

export const GET = globalErrorHandler(async () => {
    const res = successResponse(undefined, "Session invalidated successfully")
    res.cookies.delete("access_token")
    res.cookies.delete("refresh_token")
    return res
})
