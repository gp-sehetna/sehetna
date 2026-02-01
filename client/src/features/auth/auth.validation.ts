import { z } from "zod"

const OtpSchema = z.strictObject({
    otp: z
        .string()
        .regex(/^\d+$/, { error: "OTP must only contain numbers" })
        .length(6, { error: "OTP must be exactly 6 digits" }),
})

const PurposeAndOtpSchema = OtpSchema.extend({
    purpose: z.enum(["email_verification", "password_reset"]),
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

const NameSchema = z.strictObject({
    firstName: z.string().min(2, "Min username length is 2 chars"),
    lastName: z.string().max(20, "Max username length is 20 chars"),
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
}
