import { Cookies } from "@/lib/auth/cookies"
import { decodeToken, EXPIRE } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { UnauthorizedException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const GET = globalErrorHandler(async (req: NextRequest) => {
    const mainService = await MainService.getInstance()

    const token = req.cookies.get("refresh_token")?.value

    if (!token)
        throw new UnauthorizedException("Login expired, please log in again", {
            cause: "login-expired",
        })

    let decoded: ReturnType<typeof decodeToken>
    try {
        decoded = decodeToken(token, process.env.JWT_REFRESH_SECRET)
    } catch {
        throw new UnauthorizedException("Login expired, please log in again", {
            cause: "login-expired",
        })
    }

    const tokens = await mainService.authService.refresh(decoded.sub)

    const res = successResponse(undefined, "Tokens refreshed successfully")

    res.cookies.set("access_token", tokens.accessToken, Cookies.createSecure(EXPIRE.access))
    res.cookies.set("refresh_token", tokens.refreshToken, Cookies.createSecure(EXPIRE.refresh))

    return res
})
