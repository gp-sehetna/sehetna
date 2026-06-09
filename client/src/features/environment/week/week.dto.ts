import { Location } from "@/features/environment/week/week.types"
import {
    EnvironmentDataSchema,
    WeekEnvironmentQuerySchema,
} from "@/features/environment/week/week.validation"
import { format } from "date-fns"
import { z } from "zod"

type SingleWeekEnvironmentParams = z.infer<typeof WeekEnvironmentQuerySchema>
type IEnvironmentData = z.infer<typeof EnvironmentDataSchema>
class Environment implements IEnvironmentData {
    coords: string
    country_code: string
    data: IEnvironmentData["data"]
    indicators: IEnvironmentData["indicators"]

    constructor(location: Location, date: Date) {
        const { lat, lng, iso } = location
        this.coords = `${lat},${lng}`
        this.country_code = iso
        this.data = [
            {
                date: format(date, "yyyy-MM-dd"),
                aqi_pm: 0,
                pm25_ugm3: 0,
                temperature_celsius: 0,
                precipitation_mm: 0,
                heat_wave_days: 0,
                flood_indicator: 0,
            },
        ]
    }
}

export { Environment }
export type { IEnvironmentData, SingleWeekEnvironmentParams }
