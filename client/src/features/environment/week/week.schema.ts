import z from "zod"

export const WeekEnvironmentQuerySchema = z.object({
    coords: z.string().refine(
        (val) => {
            const parts = val.split(",")
            if (parts.length !== 2) return false

            const [lat, lng] = parts.map(Number)
            return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
        },
        { message: "coords must be in format lat,lng" }
    ),
    iso: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
})

export const WeekEnvironmentParamsSchema = WeekEnvironmentQuerySchema.transform((data) => {
    const [latStr, lngStr] = data.coords.split(",")

    const lat = Number(latStr)
    const lng = Number(lngStr)

    return { lat, lng, iso: data.iso, date: data.date }
})
