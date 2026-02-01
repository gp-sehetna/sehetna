import { EmailSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { email } = EmailSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const emailToken = await mainService.authService.generateAndSendOtp(email)

    const res = successResponse(undefined, "OTP generated and stored", 201)

    res.cookies.set("email_tok", emailToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60, // 5min
    })

    return res
})
