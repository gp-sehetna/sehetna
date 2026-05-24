import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

const NEXT_AUTH_COOKIE_PREFIXES = ["next-auth.", "__Secure-next-auth.", "__Host-next-auth."]

export const GET = globalErrorHandler(async (req: NextRequest) => {
    const res = successResponse(undefined, "Session invalidated successfully")
    res.cookies.delete("access_token")
    res.cookies.delete("refresh_token")

    for (const cookie of req.cookies.getAll()) {
        if (NEXT_AUTH_COOKIE_PREFIXES.some((prefix) => cookie.name.startsWith(prefix))) {
            res.cookies.delete(cookie.name)
        }
    }

    return res
})
