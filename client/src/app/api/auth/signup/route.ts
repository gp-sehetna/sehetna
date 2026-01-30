import { chainMiddlewares } from "@/lib/middleware/chain.middleware"
import { validation } from "@/lib/middleware/validation.middleware"
import { ISignupInputsDTO } from "@/lib/modules/auth/auth.dto"
import { signupSchema } from "@/lib/modules/auth/auth.validation"
import { INextRequestWithBody } from "@/lib/types/next"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { successResponse } from "@/shared/http/response"
import { MainService } from "@/shared/db/main.service"

// const authService = new AuthService
// const mainService = new MainSer 
export const POST = globalErrorHandler(async (req: INextRequestWithBody, context: any) => {
    await chainMiddlewares(validation(signupSchema))(req, context)
    
    const { firstName, lastName, email, password }: ISignupInputsDTO = req.validatedBody

    const mainService = await MainService.getInstance()

    // const user = await authService.signup({ data: { firstName, lastName, email, password } })
    const user =  await mainService.authService.signup({data: { firstName, lastName, email, password }})
    return successResponse({ message: "User registered successfully", status: 201, data: user })
    // return successResponse({message : 'Done signup!'})
})


