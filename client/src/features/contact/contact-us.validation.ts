import { z } from "zod"
import { EmailSchema } from "@/features/auth/auth.validation"
const ContactUsSchema = EmailSchema.extend({
    phone: z.string(),
    message: z.string().max(2000, "Max message length is 2000 chars"),
})

export { ContactUsSchema }
