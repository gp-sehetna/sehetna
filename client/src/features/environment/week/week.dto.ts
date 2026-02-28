import {
    EnvironmentDataSchema,
    WeekEnvironmentQuerySchema,
} from "@/features/environment/week/week.validation"
import { z } from "zod"

type SingleWeekEnvironmentParams = z.infer<typeof WeekEnvironmentQuerySchema>
type IEnvironmentData = z.infer<typeof EnvironmentDataSchema>

export type { IEnvironmentData, SingleWeekEnvironmentParams }
