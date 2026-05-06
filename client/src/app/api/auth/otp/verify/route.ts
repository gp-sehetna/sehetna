import { PurposeAndOtpSchema } from "@/features/auth/auth.validation"
import { Cookies } from "@/lib/auth/cookies"
import { decodeToken } from "@/lib/auth/token"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { MainService } from "@/shared/db/main.service"
import { UnauthorizedException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { otp, purpose } = PurposeAndOtpSchema.parse(await req.json())
    let destination: string

    switch (purpose) {
        case PurposeEnum.emailVerification:
            destination = "/authenticate/signup/credentials"
            break
        case PurposeEnum.emailChange:
            destination = "/settings/security"
            break
        case PurposeEnum.passwordReset:
            destination = "/authenticate/password/new"
            break
        default:
            destination = "/"
    }

    const mainService = await MainService.getInstance()

    const { value: emailToken } = req.cookies.get("email_token") || {}

    if (!emailToken)
        throw new UnauthorizedException("Verification expired, resend an email to try again.")

    const otpId = await mainService.authService.verifyOtp(otp, emailToken, purpose)

    if (purpose == PurposeEnum.emailChange) {
        const token = req.cookies.get("access_token")?.value

        if (!token) throw new UnauthorizedException("Session expired", { cause: "expired" })

        const userId = decodeToken(token, process.env.JWT_ACCESS_SECRET).sub
        const email = await mainService.authService.getEmailByOtpId(otpId)
        const user = await mainService.authService.updateUserEmail(userId, email)

        const res = successResponse({ destination, user }, "OTP verified successfully", 201)
        res.cookies.delete("email_token")
        res.cookies.delete("otp_id")

        return res
    }

    const res = successResponse({ destination }, "OTP verified successfully", 201)
    res.cookies.delete("email_token")
    res.cookies.set("otp_id", otpId, Cookies.createSecure(2 * 60 * 60))

    return res
})
