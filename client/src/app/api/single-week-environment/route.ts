import { OPEN_METEO_AIR_QUALITY, OPEN_METEO_HISTORICAL_WEATHER } from "@/lib/config/urls"
import { globalErrorHandler } from "@/lib/utils/response/error.handler"
import { BadRequestException } from "@/lib/utils/response/error.response"
import { NextRequest, NextResponse } from "next/server"
import { fetchWeatherApi } from "openmeteo"

type Reducer = (values: number[]) => number | null
type AggResult<T> = { date: string } & { [K in keyof T]: number | null }

type QueryParams = {
    lat: number
    lng: number
    date: string
}

type WeeklyEnvironmentData = {
    date: string
    latitude: number
    longitude: number
    pm25_ugm3: number | null
    aqi_pm: number | null
    temperature_celsius: number | null
    precipitation_mm: number | null
}

const HEAT_WAVE_DAY_THRESHOLD = 28
// Precipitation in mm ranges between 0-200+
const PRECIPITATION_THRESHOLD = 132.5

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

const sum: Reducer = (values) => values.reduce((a, b) => a + b, 0)
const avg: Reducer = (values) => (values.length ? sum(values)! / values.length : null)

function aggregateWeekly<T extends Record<string, number[]>>(
    times: Date[],
    series: T,
    samplesPerDay: number,
    reducers: { [K in keyof T]: Reducer }
): AggResult<T>[] {
    const samplesPerWeek = samplesPerDay * 7
    const result: AggResult<T>[] = []

    for (let i = 0; i < times.length; i += samplesPerWeek) {
        const week = {
            date: times[i]?.toISOString().split("T")[0] ?? "",
        } as AggResult<T>

        Object.entries(reducers).forEach(([key, reducer]) => {
            const slice = series[key].slice(i, i + samplesPerWeek)

            // @ts-expect-error TypeError
            week[key] = reducer(slice)
        })

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

    const pm2_5: number[] = Array.from(hourly.variables(0)?.valuesArray() ?? [])
    const us_aqi_pm2_5: number[] = Array.from(hourly.variables(1)?.valuesArray() ?? [])

    return aggregateWeekly(times, { pm2_5, us_aqi_pm2_5 }, 24, {
        pm2_5: avg,
        us_aqi_pm2_5: avg,
    })
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

    const temperatures: number[] = Array.from(daily.variables(0)?.valuesArray() ?? [])
    const rain: number[] = Array.from(daily.variables(1)?.valuesArray() ?? [])
    const heat_wave_days = temperatures
    const flood_indicator = rain

    return aggregateWeekly(times, { temperatures, rain, heat_wave_days, flood_indicator }, 1, {
        // TODO: Binary indicator of flood so we can derive dynamically
        flood_indicator: (vs) => Number(vs.filter((v) => v > PRECIPITATION_THRESHOLD).length > 0),
        // TODO: Derive dynamically according to location or anomaly temperature.
        heat_wave_days: (vs) => vs.filter((v) => v > HEAT_WAVE_DAY_THRESHOLD).length,
        temperatures: avg,
        rain: avg,
    })
}

export const GET = globalErrorHandler(async (request: NextRequest) => {
    const query = parseQueryParams(request)
    if (query instanceof NextResponse) return query

    const air = await fetchWeeklyAirData(query)
    const weather = await fetchWeeklyWeatherData(query)

    const merged: WeeklyEnvironmentData[] = air.map((airWeek, i) => ({
        date: airWeek.date,
        latitude: query.lat,
        longitude: query.lng,

        pm25_ugm3: airWeek.pm2_5,
        aqi_pm: airWeek.us_aqi_pm2_5,

        temperature_celsius: weather[i].temperatures,
        precipitation_mm: weather[i].rain,

        flood_indicator: weather[i].flood_indicator,
        heat_wave_days: weather[i].heat_wave_days,
    }))

    return { data: merged }
})
