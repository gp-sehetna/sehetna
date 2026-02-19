import { differenceInCalendarDays, parseISO, startOfDay, startOfWeek, subWeeks } from "date-fns"
import { z } from "zod"

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/

const WeekEnvironmentQuerySchema = z.object({
    coords: z.string().refine(
        (val) => {
            const parts = val.split(",")
            if (parts.length !== 2) return false

            const [lat, lng] = parts.map(Number)
            return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
        },
        { message: "coords must be in format lat,lng" }
    ),
    iso: z.string().length(3), // ISO-Alpha-3 country code
    date: z.string().regex(DATE_FORMAT_REGEX, "date must be YYYY-MM-DD").nullable(),
    weeks: z.coerce.number().min(0).default(0),
})

const WeekEnvironmentParamsSchema = WeekEnvironmentQuerySchema.transform((data) => {
    const [latStr, lngStr] = data.coords.split(",")

    const loc = {
        lat: Number(latStr),
        lng: Number(lngStr),
        iso: data.iso,
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

        return { loc, date: startDate, weeks }
    }

    return { loc, date: data.date, weeks: data.weeks }
})

export { WeekEnvironmentParamsSchema, WeekEnvironmentQuerySchema }
