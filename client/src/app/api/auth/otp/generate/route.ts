import { EmailSchema } from "@/features/auth/auth.validation"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { MainService } from "@/shared/db/main.service"
import { ConflictException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { email } = EmailSchema.parse(await req.json())

    const mainService = await MainService.getInstance()

    const user = await mainService.authService.getUserByEmail(email)
    if (user) throw new ConflictException("Email already exists")

    return await mainService.authService.generateAndSendOtp(email, PurposeEnum.emailVerification)
})
