import {z} from "zod"
import * as validators from "./auth.validation"
export type ISignupInputsDTO = z.infer<typeof validators.signupSchema.body>
export type ILoginInputsDTO = z.infer<typeof validators.loginSchema.body>