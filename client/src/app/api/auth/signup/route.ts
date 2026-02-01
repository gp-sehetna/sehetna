import { PasswordAndNameSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { ExpiredException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const credentials = PasswordAndNameSchema.parse(await req.json())

    const { value: otpId } = req.cookies.get("otp_id") || {}

    if (!otpId) throw new ExpiredException("No Otp Id provided in the request cookies.")

    const mainService = await MainService.getInstance()
    await mainService.authService.signup(credentials, otpId)

    const res = successResponse(undefined, "User registered successfully", 201)
    res.cookies.delete("otp_id")

    return res
})
