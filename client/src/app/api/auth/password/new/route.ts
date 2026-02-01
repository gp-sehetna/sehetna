import { PasswordSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { ExpiredException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { password: newPassword } = PasswordSchema.parse(await req.json())

    const { value: otpId } = req.cookies.get("otp_id") || {}

    if (!otpId) throw new ExpiredException("No Otp Id provided in the request cookies.")

    const mainService = await MainService.getInstance()
    const email = await mainService.authService.getEmailByOtpId(otpId)
    await mainService.authService.updateUserPassword(email, newPassword)

    const res = successResponse(undefined, "Password updated successfully", 201)
    res.cookies.delete("otp_id")

    return res
})
