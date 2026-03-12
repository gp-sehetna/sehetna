import { WeekParams } from "@/features/environment/week/week.types"
import { refineCoords } from "@/lib/utils"
import {
    differenceInCalendarDays,
    parseISO,
    startOfDay,
    startOfWeek,
    subDays,
    subWeeks,
} from "date-fns"
import { z } from "zod"

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/

const CoordinatesSchema = z.object({
    coords: z.string().refine(refineCoords, { message: "coords must be in format lat,lng" }),
    country_code: z.string().length(3), // ISO-Alpha-3 country code
})

const WeekEnvironmentQuerySchema = CoordinatesSchema.extend({
    date: z.string().regex(DATE_FORMAT_REGEX, "date must be YYYY-MM-DD").nullable(),
    weeks: z.coerce.number().min(0).default(0),
})

const EnvironmentDataSchema = CoordinatesSchema.extend({
    indicators: z
        .object({
            gdp_per_capita_usd: z.number().min(0).max(10000000).nullable(),
            food_production_index: z.number().min(0).max(100).nullable(),
            undernourishment: z.number().min(0).max(100).nullable(),
        })
        .optional(),
    data: z.array(
        z.object({
            date: z.string().regex(DATE_FORMAT_REGEX, "date must be YYYY-MM-DD"),
            pm25_ugm3: z.number().min(0).max(500).nullable(),
            aqi_pm: z.number().min(0).max(400).nullable(),
            temperature_celsius: z.number().min(-50).max(50).nullable(),
            precipitation_mm: z.number().min(0).max(300).nullable(),
            heat_wave_days: z.number().min(0).max(7).nullable(),
            flood_indicator: z.number().min(0).max(1).nullable(),
        })
    ),
})

const WeekEnvironmentParamsSchema = WeekEnvironmentQuerySchema.transform<WeekParams>((data) => {
    const [latStr, lngStr] = data.coords.split(",")

    const loc = {
        lat: Number(latStr),
        lng: Number(lngStr),
        iso: data.country_code,
    }

    if (!data.date || !data.weeks) {
        /**
         * ? THIS IS A MOCK
         *
         * Should call the database and get the last start_date from record with flag = `prediction`
         * TODO: if date is null, get date (start_date) from latest record from the database (predictions)
         * * FINISHED: if weeks is 0, set end_date to today
         * * FINISHED: Calculate number of weeks from start_date to end_date
         */
        const startDate = "2025-10-01"

        const start = startOfDay(parseISO(startDate))
        const lastWeek = subWeeks(new Date(), 1)
        const firstDayOfLastWeek = startOfWeek(lastWeek)

        const diffDays = differenceInCalendarDays(firstDayOfLastWeek, start)
        const weeks = Math.max(1, Math.ceil((diffDays + 1) / 7))

        return { loc, date: subDays(startOfWeek(startDate), 1), weeks }
    }

    return { loc, date: subDays(startOfWeek(data.date), 1), weeks: data.weeks }
})

export { EnvironmentDataSchema, WeekEnvironmentParamsSchema, WeekEnvironmentQuerySchema }
