import { z } from "zod"
import { EmailSchema } from "@/features/auth/auth.validation"
const ContactUsSchema = EmailSchema.extend({
    name: z.string().min(1, "Name is required.").max(50, "Max name length is 50 characters."),
    phone: z.string().regex(/^01[0125]\d{8}$/, "Phone number must be in this format: 01XXXXXXXXX."),
    message: z
        .string()
        .min(1, "Message is required.")
        .max(2000, "Max message length is 2000 characters."),
})

export { ContactUsSchema }
