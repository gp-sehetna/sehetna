import { IEnvironmentData } from "@/features/environment/week/week.dto"
import {
    AggResult,
    HEAT_WAVE_DAY_THRESHOLD,
    Location,
    PRECIPITATION_THRESHOLD,
    Reducer,
    WeeklyEnvironmentData,
    WeekParams,
} from "@/features/environment/week/week.types"
import { getWeekRange } from "@/lib/utils/date"
import { externalApi } from "@/shared/api"
import {
    OPEN_METEO_AIR_QUALITY,
    OPEN_METEO_HISTORICAL_WEATHER,
    WORLDBANK,
} from "@/shared/config/urls"
import { endOfWeek, format, subDays, subWeeks } from "date-fns"
import { SearchParamsOption } from "ky"
import { fetchWeatherApi } from "openmeteo"

export class WeekService {
    async getWeeklyEnvironmentData(query: WeekParams): Promise<IEnvironmentData | null> {
        try {
            // TODO: Check if its `query.date` is today's week then subtract 1 week, else don't subtract
            const { startDate, endDate } = getWeekRange(subWeeks(query.date, 1), query.weeks)
            const endOfWeekOfEndDate = endOfWeek(subDays(endDate, 1))

            const [air, weather] = await Promise.all([
                this.fetchWeeklyAirData(startDate, endOfWeekOfEndDate, query.loc),
                this.fetchWeeklyWeatherData(startDate, endOfWeekOfEndDate, query.loc),
            ])

            const indicators = await this.fetchIndicators(query.loc.iso, startDate.getFullYear())

            const data: WeeklyEnvironmentData[] = air.map((airWeek, i) => ({
                date: airWeek.date,

                pm25_ugm3: airWeek.pm2_5,
                aqi_pm: airWeek.us_aqi_pm2_5,

                temperature_celsius: weather[i]?.average_temperature ?? null,
                precipitation_mm: weather[i]?.average_precipitation ?? null,

                flood_indicator: weather[i]?.is_flooded ?? null,
                heat_wave_days: weather[i]?.heat_wave_days ?? null,
            }))

            return {
                coords: `${query.loc.lat},${query.loc.lng}`,
                country_code: query.loc.iso,
                indicators,
                data,
            }
        } catch (err: unknown) {
            if (err instanceof Error) return null
            throw err
        }
    }

    private async fetchIndicators(countryCode: string, year: number) {
        const base = `${WORLDBANK}/countries/${countryCode}/indicators`
        const searchParams: SearchParamsOption = { format: "json", date: year.toString() }

        const [gdp, food, hunger] = await Promise.all([
            externalApi.get<any[]>(`${base}/NY.GDP.PCAP.CD`, { searchParams }).json(),
            externalApi.get<any[]>(`${base}/AG.PRD.FOOD.XD`, { searchParams }).json(),
            externalApi.get<any[]>(`${base}/SN.ITK.DEFC.ZS`, { searchParams }).json(),
        ])

        return {
            gdp_per_capita_usd: gdp?.[1]?.[0]?.value ?? null,
            food_production_index: food?.[1]?.[0]?.value ?? null,
            undernourishment: hunger?.[1]?.[0]?.value ?? null,
        }
    }

    private async fetchWeeklyAirData(startDate: Date, endDate: Date, location: Location) {
        const [response] = await fetchWeatherApi(
            OPEN_METEO_AIR_QUALITY,
            this.buildMeteoParams(startDate, endDate, location, {
                hourly: ["pm2_5", "us_aqi_pm2_5"],
            })
        )

        const hourly = response.hourly()!
        const times = this.buildTimes(
            Number(hourly.time()),
            Number(hourly.timeEnd()),
            hourly.interval(),
            response.utcOffsetSeconds()
        )

        return this.aggregateWeekly(
            times,
            {
                pm2_5: Array.from(hourly.variables(0)?.valuesArray() ?? []),
                us_aqi_pm2_5: Array.from(hourly.variables(1)?.valuesArray() ?? []),
            },
            24,
            { pm2_5: this.avg, us_aqi_pm2_5: this.avg }
        )
    }

    private async fetchWeeklyWeatherData(startDate: Date, endDate: Date, location: Location) {
        const [response] = await fetchWeatherApi(
            OPEN_METEO_HISTORICAL_WEATHER,
            this.buildMeteoParams(startDate, endDate, location, {
                daily: ["temperature_2m_mean", "rain_sum"],
            })
        )

        const daily = response.daily()!
        const times = this.buildTimes(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval(),
            response.utcOffsetSeconds()
        )

        return this.aggregateWeekly(
            times,
            {
                average_temperature: Array.from(daily.variables(0)?.valuesArray() ?? []),
                average_precipitation: Array.from(daily.variables(1)?.valuesArray() ?? []),
                heat_wave_days: Array.from(daily.variables(0)?.valuesArray() ?? []),
                is_flooded: Array.from(daily.variables(1)?.valuesArray() ?? []),
            },
            1,
            {
                average_temperature: this.avg,
                average_precipitation: this.avg,
                heat_wave_days: (vs) => vs.filter((v) => v > HEAT_WAVE_DAY_THRESHOLD).length,
                is_flooded: (vs) => Number(vs.some((v) => v > PRECIPITATION_THRESHOLD)),
            }
        )
    }

    private buildMeteoParams(startDate: Date, endDate: Date, location: Location, options: any) {
        // TODO: timezone/localtime handling and verification
        return {
            latitude: location.lat,
            longitude: location.lng,
            start_date: format(startDate, "yyyy-MM-dd"),
            end_date: format(endDate, "yyyy-MM-dd"),
            timezone: "auto",
            ...options,
        }
    }

    private buildTimes(start: number, end: number, interval: number, offset: number): Date[] {
        const length = (end - start) / interval
        return Array.from({ length }, (_, i) => new Date((start + i * interval + offset) * 1000))
    }

    private sum: Reducer = (vs) => vs.reduce((a, b) => a + b, 0)
    private avg: Reducer = (vs) => (vs.length ? this.sum(vs)! / vs.length : null)

    private aggregateWeekly<T extends Record<string, number[]>>(
        times: Date[],
        series: T,
        samplesPerDay: number,
        reducers: { [K in keyof T]: Reducer }
    ): AggResult<T>[] {
        const samplesPerWeek = samplesPerDay * 7
        const result: AggResult<T>[] = []

        for (let i = 0; i < times.length; i += samplesPerWeek) {
            const week: any = { date: times[i]?.toISOString().split("T")[0] ?? "" }

            for (const key in reducers) {
                week[key] = reducers[key](series[key].slice(i, i + samplesPerWeek))
            }

            result.push(week)
        }

        return result
    }
}
