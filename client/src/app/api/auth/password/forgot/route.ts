import { EmailSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { email } = EmailSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const userId = await mainService.authService.getUserIdByEmail(email)

    const res = successResponse(undefined, "User found")
    res.cookies.set("password/forgot/user_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1hr
    })
    return res
})
