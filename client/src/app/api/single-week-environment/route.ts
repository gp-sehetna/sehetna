import { NextRequest, NextResponse } from "next/server"
import { fetchWeatherApi } from "openmeteo"
import { OPEN_METEO_AIR_QUALITY, OPEN_METEO_HISTORICAL_WEATHER } from "@/lib/config/urls"
import { globalErrorHandler } from "@/lib/utils/response/error.handler"
import { BadRequestException } from "@/lib/utils/response/error.response"

type AggregateType = "avg" | "sum"

type QueryParams = {
    lat: number
    lng: number
    date: string
}

type WeeklyEnvironmentData = {
    date: string
    latitude: number
    longitude: number
    pm25_ugm3: number
    aqi_pm: number
    temperature_celsius: number | null
    precipitation_mm: number | null
}

function parseQueryParams(request: NextRequest): QueryParams | NextResponse {
    const params = request.nextUrl.searchParams

    const lat = Number(params.get("lat"))
    const lng = Number(params.get("lng"))
    const date = params.get("date")

    if (!lat || !lng || !date) {
        const details = Object.fromEntries(params.entries())
        throw new BadRequestException("Invalid query parameters", details)
    }
    return { lat, lng, date }
}

function buildMeteoParams(
    { lat, lng, date }: QueryParams,
    options: { hourly?: string[]; daily?: string[] }
) {
    return {
        latitude: lat,
        longitude: lng,
        start_date: date,
        end_date: "2026-01-23", // TODO: derive dynamically (+7 days)
        timezone: "auto",
        ...options,
    }
}

function buildTimes(start: number, end: number, interval: number, utcOffsetSecs: number): Date[] {
    const length = (end - start) / interval

    return Array.from({ length }, (_, i) => {
        const timestamp = start + i * interval + utcOffsetSecs
        return new Date(timestamp * 1000)
    })
}

function aggregateWeekly<T extends Record<string, number[]>>(
    times: Date[],
    series: T,
    samplesPerDay: number,
    reducers: Record<keyof T, AggregateType>
): ({ date: string } & Record<keyof T, number | null>)[] {
    const samplesPerWeek = samplesPerDay * 7
    const result: any[] = []

    for (let i = 0; i < times.length; i += samplesPerWeek) {
        const week: any = {
            date: times[i]?.toISOString().split("T")[0] ?? "",
        }

        for (const key in series) {
            const slice = series[key].slice(i, i + samplesPerWeek)

            if (!slice.length) {
                week[key] = null
                continue
            }

            const sum = slice.reduce((a, b) => a + b, 0)
            week[key] = reducers[key] === "sum" ? sum : sum / slice.length
        }

        result.push(week)
    }

    return result
}

async function fetchWeeklyAirData(query: QueryParams) {
    const [response] = await fetchWeatherApi(
        OPEN_METEO_AIR_QUALITY,
        buildMeteoParams(query, { hourly: ["pm2_5", "us_aqi_pm2_5"] })
    )

    const hourly = response.hourly()!
    const times = buildTimes(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval(),
        response.utcOffsetSeconds()
    )

    const pm2_5 = Array.from(hourly.variables(0)?.valuesArray() ?? [])
    const us_aqi_pm2_5 = Array.from(hourly.variables(1)?.valuesArray() ?? [])

    return {
        latitude: response.latitude(),
        longitude: response.longitude(),
        weekly: aggregateWeekly(times, { pm2_5, us_aqi_pm2_5 }, 24, {
            pm2_5: "avg",
            us_aqi_pm2_5: "avg",
        }),
    }
}

async function fetchWeeklyWeatherData(query: QueryParams) {
    const [response] = await fetchWeatherApi(
        OPEN_METEO_HISTORICAL_WEATHER,
        buildMeteoParams(query, { daily: ["temperature_2m_mean", "rain_sum"] })
    )

    const daily = response.daily()!
    const times = buildTimes(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval(),
        response.utcOffsetSeconds()
    )

    const temperatures = Array.from(daily.variables(0)?.valuesArray() ?? [])
    const rain = Array.from(daily.variables(1)?.valuesArray() ?? [])

    return aggregateWeekly(times, { temperatures, rain }, 1, {
        temperatures: "avg",
        rain: "avg",
    })
}

export const GET = globalErrorHandler(async (request: NextRequest) => {
    const query = parseQueryParams(request)
    if (query instanceof NextResponse) return query

    const air = await fetchWeeklyAirData(query)
    const weather = await fetchWeeklyWeatherData(query)

    const merged: WeeklyEnvironmentData[] = air.weekly.map((airWeek, i) => {
        const weatherWeek = weather[i]

        return {
            date: airWeek.date,
            latitude: air.latitude,
            longitude: air.longitude,
            pm25_ugm3: airWeek.pm2_5 ?? 0,
            aqi_pm: airWeek.us_aqi_pm2_5 ?? 0,
            temperature_celsius: weatherWeek?.temperatures ?? null,
            precipitation_mm: weatherWeek?.rain ?? null,
        }
    })

    return { data: merged }
})
