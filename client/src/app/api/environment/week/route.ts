import { WeekEnvironmentParamsSchema } from "@/features/environment/week/week.schema"
import {
    OPENCAGE_GEOCODE,
    OPEN_METEO_AIR_QUALITY,
    OPEN_METEO_HISTORICAL_WEATHER,
    WORLDBANK,
} from "@/shared/config/urls"
import { BadRequestException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import ky, { SearchParamsOption } from "ky"
import { NextRequest } from "next/server"
import { fetchWeatherApi } from "openmeteo"
import z from "zod"

type Reducer = (values: number[]) => number | null
type AggResult<T> = { date: string } & { [K in keyof T]: number | null }

type QueryParams = {
    lat: number
    lng: number
    date: string
}

interface WeeklyEnvironmentData {
    date: string
    pm25_ugm3: number | null
    aqi_pm: number | null

    temperature_celsius: number | null
    precipitation_mm: number | null

    heat_wave_days: number | null
    flood_indicator: number | null
}

const HEAT_WAVE_DAY_THRESHOLD = 28
// Precipitation in mm ranges between 0-200+
const PRECIPITATION_THRESHOLD = 132.5
const externalApi = ky.create({ timeout: 20000 })

function parseWeekEnvironmentParams(request: NextRequest): QueryParams {
    const params = request.nextUrl.searchParams

    const raw = { coords: params.get("coords"), date: params.get("date") }

    const result = WeekEnvironmentParamsSchema.safeParse(raw)

    if (!result.success)
        throw new BadRequestException("Invalid query parameters", z.treeifyError(result.error))

    return result.data
}

function buildMeteoParams(query: QueryParams, options: { hourly?: string[]; daily?: string[] }) {
    return {
        latitude: query.lat,
        longitude: query.lng,
        start_date: query.date,
        end_date: "2021-05-23", // TODO: derive dynamically (+7 days)
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

    const average_temperature: number[] = Array.from(daily.variables(0)?.valuesArray() ?? [])
    const average_precipitation: number[] = Array.from(daily.variables(1)?.valuesArray() ?? [])
    const heat_wave_days = average_temperature
    const is_flooded = average_precipitation

    return aggregateWeekly(
        times,
        { average_temperature, average_precipitation, heat_wave_days, is_flooded },
        1,
        {
            // TODO: Binary indicator of flood in this week, we can derive dynamically
            is_flooded: (vs) => Number(vs.filter((v) => v > PRECIPITATION_THRESHOLD).length > 0),
            // TODO: Derive dynamically according to location or anomaly temperature.
            heat_wave_days: (vs) => vs.filter((v) => v > HEAT_WAVE_DAY_THRESHOLD).length,
            average_temperature: avg,
            average_precipitation: avg,
        }
    )
}

const fetchIndicators = async (CC: string, year: number) => {
    const url = `${WORLDBANK}/countries/${CC}/indicators`
    const searchParams: SearchParamsOption = { format: "json", date: year.toString() }

    const gdpPerCapitaData: Array<any> = await externalApi
        .get(`${url}/NY.GDP.PCAP.CD`, { searchParams })
        .json()
    const foodProductionData: Array<any> = await externalApi
        .get(`${url}/AG.PRD.FOOD.XD`, { searchParams })
        .json()
    const undernourishmentData: Array<any> = await externalApi
        .get(`${url}/SN.ITK.DEFC.ZS`, { searchParams })
        .json()

    const [gdpPerCapita, foodProductionIndex, undernourishment] = [
        gdpPerCapitaData[1]?.[0] ?? null,
        foodProductionData[1]?.[0] ?? null,
        undernourishmentData[1]?.[0] ?? null,
    ]

    return [gdpPerCapita?.value, foodProductionIndex?.value, undernourishment?.value]
}

const fetchCountryCode = async (lat: number, lng: number) => {
    const searchParams: SearchParamsOption = { q: `${lat}+${lng}`, key: process.env.OPENCAGE_KEY }
    const { results }: { results: Array<any> } = await externalApi
        .get(OPENCAGE_GEOCODE, { searchParams })
        .json()

    const countryCode: string = results[0].components["ISO_3166-1_alpha-3"]
    if (!countryCode)
        throw new BadRequestException(
            "Invalid coordinates: country code not found using these coordinates",
            { coords: `${lat},${lng}` }
        )

    return countryCode
}

export const GET = globalErrorHandler(async (request: NextRequest) => {
    const query = parseWeekEnvironmentParams(request)

    const air = await fetchWeeklyAirData(query)
    const weather = await fetchWeeklyWeatherData(query)

    /* // TODO: Derive other indicators
     * Availability: Food production index (2014-2016 = 100) <https://api.worldbank.org/v2/countries/EGY/indicators/AG.PRD.FOOD.XD?format=json>
     * Utilization: 2.1.1 Prevalence of undernourishment <https://api.worldbank.org/v2/countries/EGY/indicators/SN.ITK.DEFC.ZS?format=json>
     * Access: Percentage of the population unable to afford a healthy diet (percent) <server/resources/data/indicators/FAO_CAHD_7005.csv>
     * Stability: Prevalence of moderate or severe food insecurity in the total population (percent) (3-year average) <server/resources/data/indicators/FAO_FS_210091.csv>
     */
    const country_code = await fetchCountryCode(query.lat, query.lng)
    const [gdp_per_capita_usd, food_production_index, undernourishment] = await fetchIndicators(
        country_code,
        new Date(query.date).getFullYear()
    )

    const weeklyEnvironmentData: WeeklyEnvironmentData[] = air.map((airWeek, i) => ({
        date: airWeek.date,

        pm25_ugm3: airWeek.pm2_5,
        aqi_pm: airWeek.us_aqi_pm2_5,

        temperature_celsius: weather[i].average_temperature,
        precipitation_mm: weather[i].average_precipitation,

        flood_indicator: weather[i].is_flooded,
        heat_wave_days: weather[i].heat_wave_days,
    }))

    return {
        coords: `${query.lat},${query.lng}`,
        country_code,
        indicators: {
            gdp_per_capita_usd,
            food_production_index,
            undernourishment,
        },
        data: weeklyEnvironmentData,
    }
})
