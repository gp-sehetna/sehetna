import { WeekEnvironmentQuerySchema } from "@/features/environment/week/week.schema"
import z from "zod"

export type SingleWeekEnvironmentParams = z.infer<typeof WeekEnvironmentQuerySchema>
