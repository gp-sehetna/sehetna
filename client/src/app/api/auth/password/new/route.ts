import { PasswordSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { ExpiredException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { password } = PasswordSchema.parse(await req.json())

    const { value: userId } = req.cookies.get("password/forgot/user_id") || {}

    if (!userId) throw new ExpiredException("No User ID provided in the request cookies.")

    const mainService = await MainService.getInstance()
    await mainService.authService.updateUserPassword(userId, password)

    const res = successResponse(undefined, "User password updated successfully")
    res.cookies.delete("password/forgot/user_id")

    return res
})
