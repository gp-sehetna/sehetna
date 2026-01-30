import { LoginSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const credentials = LoginSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const tokens = await mainService.authService.login(credentials)

    return [tokens, "User logged in successfully"]
})
