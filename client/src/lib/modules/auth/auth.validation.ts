import z from "zod"

export const loginSchema = {
    body: z.strictObject({
        email: z.email({ error: "Valid email must be like : example@domain.com" }),
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                "Password must contain uppercase, lowercase, number, and special character"
            ),
    }),
}

export const signupSchema = {
    body: z.strictObject({
        email: z.email({ error: "Valid email must be like : example@domain.com" }),
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                "Password must contain uppercase, lowercase, number, and special character"
            ),
        firstName: z.string().min(2, "Min username length is 2 chars"),
        lastName: z.string().max(20, "Max username length is 20 chars"),
    }),
}
