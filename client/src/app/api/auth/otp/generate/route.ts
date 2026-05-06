import { PurposeAndEmailSchema } from "@/features/auth/auth.validation"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { MainService } from "@/shared/db/main.service"
import { ConflictException, UnauthorizedException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { decodeToken } from "@/lib/auth/token"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { email, purpose = PurposeEnum.emailVerification } = PurposeAndEmailSchema.parse(
        await req.json()
    )

    const mainService = await MainService.getInstance()

    const user = await mainService.authService.getUserByEmail(email)

    if (purpose == PurposeEnum.emailChange) {
        const token = req.cookies.get("access_token")?.value
        if (!token) throw new UnauthorizedException("Session expired", { cause: "expired" })

        const userId = decodeToken(token, process.env.JWT_ACCESS_SECRET).sub

        if (user && user._id.toString() !== userId)
            throw new ConflictException("Email already exists")
    } else if (user) {
        throw new ConflictException("Email already exists")
    }

    return await mainService.authService.generateAndSendOtp(email, purpose)
})
