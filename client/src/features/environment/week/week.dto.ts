import { WeekEnvironmentQuerySchema } from "@/features/environment/week/week.validation"
import { z } from "zod"

export type SingleWeekEnvironmentParams = z.infer<typeof WeekEnvironmentQuerySchema>
