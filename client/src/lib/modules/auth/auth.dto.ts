import { z } from "zod"
import * as validators from "./auth.validation"
type ISignupInputsDTO = z.infer<typeof validators.signupSchema.body>
type ILoginInputsDTO = z.infer<typeof validators.loginSchema.body>

export type { ILoginInputsDTO, ISignupInputsDTO }
