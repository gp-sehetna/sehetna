import z from "zod"
import { WeekEnvironmentQuerySchema } from "./core.business-logic.validation"

type SingleWeekEnvironmentParams = z.infer<typeof WeekEnvironmentQuerySchema>
export type { SingleWeekEnvironmentParams }
