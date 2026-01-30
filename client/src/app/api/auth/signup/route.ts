import { SignupSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { NextRequest } from "next/server"

export const POST = globalErrorHandler(async (req: NextRequest) => {
    const credentials = SignupSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    const user = await mainService.authService.signup(credentials)

    return [user, "User registered successfully", 201]
})
