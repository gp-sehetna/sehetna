import { z } from "zod"
import * as v from "@/features/engagements/engagements.validation"
type ContactUsDTO = z.infer<typeof v.ContactUsSchema>

export type { ContactUsDTO }
