import { chainMiddlewares } from "@/lib/middleware/chain.middleware"
import { validation } from "@/lib/middleware/validation.middleware"
import { ILoginInputsDTO } from "@/lib/modules/auth/auth.dto"
import { loginSchema } from "@/lib/modules/auth/auth.validation"
import { INextRequestWithBody } from "@/lib/types/next"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"

export const POST = globalErrorHandler(async (req: INextRequestWithBody, context: any) => {
    await chainMiddlewares(validation(loginSchema))(req, context)

    const { email, password }: ILoginInputsDTO = req.validatedBody
    const mainService = await MainService.getInstance()

    const credentials = await mainService.authService.login({ data: { email, password } })

    return successResponse({ data: credentials, message: "user Logged-in successfully" })
})
