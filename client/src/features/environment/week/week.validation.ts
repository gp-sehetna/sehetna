import { z } from "zod"

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
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
    weeks: z.coerce.number().min(1).default(0),
})

const WeekEnvironmentParamsSchema = WeekEnvironmentQuerySchema.transform((data) => {
    const [latStr, lngStr] = data.coords.split(",")

    const loc = {
        lat: Number(latStr),
        lng: Number(lngStr),
        iso: data.iso,
    }

    /**
     * TODO: if date is null, get date (start_date) from latest record from the database (predictions)
     * TODO: if weeks is 0, set end_date to today
     * TODO: Calculate number of weeks from start_date to end_date
     **/
    return { loc, date: data.date, weeks: data.weeks }
})

export { WeekEnvironmentParamsSchema, WeekEnvironmentQuerySchema }
