import { NextResponse } from "next/server"
import { fetchWeatherApi } from "openmeteo"

type AggregateType = "avg" | "sum"
type WeeklyAirData = {
    date: string
    pm2_5: number | null
    us_aqi_pm2_5: number | null
}

type WeeklyWeatherData = {
    date: string
    latitude: number
    longitude: number
    pm25_ugm3: number
    aqi_pm: number
    temperature_celsius: number | null
    precipitation_mm: number | null
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

const createMeteoParams = ({ hourly, daily }: { hourly?: string[]; daily?: string[] }) => ({
    latitude: 52.52,
    longitude: 13.41,
    ...(hourly && { hourly }),
    ...(daily && { daily }),
    start_date: "2024-01-15",
    end_date: "2024-01-28",
    timezone: "auto",
})

export const GET = async () => {
    const airParams = createMeteoParams({
        hourly: ["pm2_5", "us_aqi_pm2_5"],
    })

    const url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    const responses = await fetchWeatherApi(url, airParams)
    const response = responses[0]

    const hourly = response.hourly()!

    const utcOffsetSeconds = response.utcOffsetSeconds()

    const times: Date[] = Array.from(
        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        (_, i) =>
            new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    )

    const pm2_5 = Array.from(hourly.variables(0)?.valuesArray() ?? [])
    const us_aqi_pm2_5 = Array.from(hourly.variables(1)?.valuesArray() ?? [])

    const weeklyAir: WeeklyAirData[] = aggregateWeekly(times, { pm2_5, us_aqi_pm2_5 }, 24, {
        pm2_5: "avg",
        us_aqi_pm2_5: "avg",
    })

    // -----------
    const weatherParams = createMeteoParams({ daily: ["temperature_2m_mean", "rain_sum"] })

    const weatherUrl = "https://archive-api.open-meteo.com/v1/archive"
    const weatherResponses = await fetchWeatherApi(weatherUrl, weatherParams)
    const weatherResponse = weatherResponses[0]

    const utcOffsetSecondsWeather = weatherResponse.utcOffsetSeconds()
    const daily = weatherResponse.daily()!
    const weatherTimes = Array.from(
        { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
        (_, i) =>
            new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSecondsWeather) * 1000)
    )

    const temperatures = Array.from(daily.variables(0)?.valuesArray() ?? [])

    const rain = Array.from(daily.variables(1)?.valuesArray() ?? [])

    const weeklyWeather = aggregateWeekly<{
        temperatures: number[]
        rain: number[]
    }>(weatherTimes, { temperatures, rain }, 1, {
        temperatures: "avg",
        rain: "avg",
    })

    const mergedWeekly: WeeklyWeatherData[] = weeklyAir.map((airWeek, i) => {
        const weatherWeek = weeklyWeather[i]

        return {
            date: airWeek.date,
            latitude: response.latitude(),
            longitude: response.longitude(),

            pm25_ugm3: airWeek.pm2_5 ?? 0,
            aqi_pm: airWeek.us_aqi_pm2_5 ?? 0,

            temperature_celsius: weatherWeek?.temperatures ?? null,
            precipitation_mm: weatherWeek?.rain ?? null,
        }
    })

    return NextResponse.json({ weeklyData: mergedWeekly })
}
