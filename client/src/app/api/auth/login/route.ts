import { LoginSchema } from "@/features/auth/auth.validation"
import { Cookies } from "@/lib/auth/cookies"
import { EXPIRE } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const credentials = LoginSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const { user, tokens } = await mainService.authService.login(credentials)
    const res = successResponse({ data: user }, "User logged in successfully")

    res.cookies.set("access_token", tokens.accessToken, Cookies.createSecure(EXPIRE.access))
    res.cookies.set("refresh_token", tokens.refreshToken, Cookies.createSecure(EXPIRE.refresh))

    return res
})
