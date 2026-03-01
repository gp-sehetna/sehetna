import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { z } from "zod"

const FIELD_REQUIRED = 2
const NAME_MAX_LENGTH = 50
const DESC_MAX_LENGTH = 6000

const OtpSchema = z.strictObject({
    otp: z
        .string()
        .regex(/^\d+$/, { error: "OTP must only contain numbers" })
        .length(6, { error: "OTP must be exactly 6 digits" }),
})

const PurposeAndOtpSchema = OtpSchema.extend({
    purpose: z.enum(PurposeEnum),
})

const EmailSchema = z.strictObject({
    email: z.email({ error: "Email address isn't in the expected format, abc@gmail.com" }),
})

const PasswordSchema = z.strictObject({
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),
})

const ConfirmPasswordSchema = PasswordSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

// TODO: double check on constraints of both fields, both should have the same min/max
const baseName = z
    .string()
    .min(FIELD_REQUIRED, `Min length is ${FIELD_REQUIRED} chars`)
    .max(NAME_MAX_LENGTH, `Max length is ${NAME_MAX_LENGTH} chars`)

const NameSchema = z.strictObject({
    firstName: baseName,
    lastName: baseName,
})

const LoginSchema = EmailSchema.extend(PasswordSchema.shape)
const SignupSchema = LoginSchema.extend(NameSchema.shape)
const PasswordAndNameSchema = NameSchema.extend(PasswordSchema.shape)

export {
    ConfirmPasswordSchema,
    EmailSchema,
    LoginSchema,
    OtpSchema,
    PasswordAndNameSchema,
    PasswordSchema,
    PurposeAndOtpSchema,
    SignupSchema,
    FIELD_REQUIRED,
    NAME_MAX_LENGTH,
    DESC_MAX_LENGTH,
}
