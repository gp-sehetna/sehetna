import { chainMiddlewares } from "@/lib/middleware/chain.middleware"
import { validation } from "@/lib/middleware/validation.middleware"
import { ISignupInputsDTO } from "@/lib/modules/auth/auth.dto"
import { signupSchema } from "@/lib/modules/auth/auth.validation"
import { INextRequestWithBody } from "@/lib/types/next"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"

export const POST = globalErrorHandler(async (req: INextRequestWithBody, context: any) => {
    await chainMiddlewares(validation(signupSchema))(req, context)

    const { firstName, lastName, email, password }: ISignupInputsDTO = req.validatedBody

    // Check if user exists (DB logic)

    // Hash password
    return successResponse({ data: { firstName, lastName, email, password } }, 201)
})
