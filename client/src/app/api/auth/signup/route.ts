import { chainMiddlewares } from "@/lib/middleware/chain.middleware"
import { validation } from "@/lib/middleware/validation.middleware"
import { successResponse } from "@/lib/utils/api.response"
import * as validators from "@/lib/modules/auth/auth.validation"
import { handleErrors } from "@/lib/utils/error.handler"
import { INextRequestWithBody } from "@/lib/utils/types/request.next"
import { ISignupInputsDTO } from "@/lib/modules/auth/auth.dto"
export const POST = async (req: INextRequestWithBody, context: any) => {
    try {
        await chainMiddlewares(validation(validators.signupSchema))(req, context)

        const { firstName, lastName, email, password } : ISignupInputsDTO = req.validatedBody

                
        // Check if user exists (DB logic)

        // Hash password
        return successResponse(
            {
                message: "User created successfully",
                data: { firstName, lastName, email, password },
            },
            201
        )
    } catch (error) {
        return handleErrors(error)
    }
}
