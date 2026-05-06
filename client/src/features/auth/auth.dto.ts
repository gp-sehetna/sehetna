import { z } from "zod"
import * as v from "@/features/auth/auth.validation"
type ISignupInputsDTO = z.infer<typeof v.SignupSchema>
type ILoginInputsDTO = z.infer<typeof v.LoginSchema>
type EmailInputsDTO = z.infer<typeof v.EmailSchema>
type PurposeAndEmailInputsDTO = z.infer<typeof v.PurposeAndEmailSchema>
type OTPInputsDTO = z.infer<typeof v.OtpSchema>
type PasswordInputsDTO = z.infer<typeof v.PasswordSchema>
type ConfirmPasswordInputsDTO = z.infer<typeof v.ConfirmPasswordSchema>
type PasswordAndNameInputsDTO = z.infer<typeof v.PasswordAndNameSchema>
type ManipulatedUserDataInputsDTO = z.infer<typeof v.ManipulatedUserDataSchema>

export type {
    ILoginInputsDTO,
    ISignupInputsDTO,
    EmailInputsDTO,
    PurposeAndEmailInputsDTO,
    OTPInputsDTO,
    PasswordInputsDTO,
    ConfirmPasswordInputsDTO,
    PasswordAndNameInputsDTO,
    ManipulatedUserDataInputsDTO,
}
