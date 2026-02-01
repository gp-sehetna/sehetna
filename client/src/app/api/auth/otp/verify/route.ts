import { PurposeAndOtpSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { UnauthorizedException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { otp, purpose } = PurposeAndOtpSchema.parse(await req.json())
    const destination =
        purpose == "email_verification"
            ? "/authenticate/signup/credentials"
            : "/authenticate/password/new"

    const mainService = await MainService.getInstance()

    const { value: emailToken } = req.cookies.get("email_token") || {}

    if (!emailToken)
        throw new UnauthorizedException("Verification expired, resend an email to try again.")

    const otpId = await mainService.authService.verifyOtp(otp, emailToken, purpose)

    const res = successResponse({ destination }, "OTP verified successfully", 201)
    res.cookies.delete("email_token")
    res.cookies.set("otp_id", otpId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60, // 2hr
    })

    return res
})
