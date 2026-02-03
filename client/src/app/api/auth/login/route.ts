import { LoginSchema } from "@/features/auth/auth.validation"
import { EXPIRE } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const credentials = LoginSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const tokens = await mainService.authService.login(credentials)
    const res = successResponse(undefined, "User logged in successfully")

    // TODO: Move this function in utils so its used in multiple places
    const cookiesOptions = (expiresAt: number): Partial<ResponseCookie> => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
    })

    res.cookies.set("access_token", tokens.accessToken, cookiesOptions(EXPIRE.access))
    res.cookies.set("refresh_token", tokens.refreshToken, cookiesOptions(EXPIRE.access))

    return res
})
