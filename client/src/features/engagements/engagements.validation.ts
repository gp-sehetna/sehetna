import { z } from "zod"
import { EmailSchema } from "@/features/auth/auth.validation"
import { NAME_MAX_LENGTH, FIELD_REQUIRED, DESC_MAX_LENGTH } from "@/features/auth/auth.validation"

const PHONE_REGEX = /^01[0125]\d{8}$/

const ContactUsSchema = EmailSchema.extend({
    name: z
        .string()
        .min(FIELD_REQUIRED, "Name is required.")
        .max(NAME_MAX_LENGTH, `Max name length is ${NAME_MAX_LENGTH} characters.`),
    phone: z.union([
        z.literal(""),
        z.string().regex(PHONE_REGEX, "Phone number must be in this format: 01XXXXXXXXX."),
    ]),
    message: z
        .string()
        .min(FIELD_REQUIRED, "Message is required.")
        .max(DESC_MAX_LENGTH, `Max message length is ${DESC_MAX_LENGTH} characters.`),
})

export { ContactUsSchema }
