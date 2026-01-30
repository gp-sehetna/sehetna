import { z } from "zod"
import * as validators from "./auth.validation"
type ISignupInputsDTO = z.infer<typeof validators.SignupSchema>
type ILoginInputsDTO = z.infer<typeof validators.LoginSchema>

export type { ILoginInputsDTO, ISignupInputsDTO }
