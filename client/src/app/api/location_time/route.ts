import { NextResponse } from "next/server"
import { fetchWeatherApi } from "openmeteo"

type AggregateType = "avg" | "sum"
type WeeklyWeatherData = {
    aqi_pm: number
    country_code: string
    date: string
    latitude: number
    longitude: number
    pm25_ugm3: 0
    precipitation_mm: number
    temperature_celsius: number
}

function aggregateWeekly(
    times: Date[],
    series: Record<string, number[]>,
    samplesPerDay: number,
    reducers: Record<string, AggregateType>
) {
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

            if (reducers[key] === "sum") {
                week[key] = slice.reduce((a, b) => a + b, 0)
            } else {
                week[key] = slice.reduce((a, b) => a + b, 0) / slice.length
            }
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

    const weeklyAir = aggregateWeekly(times, { pm2_5, us_aqi_pm2_5 }, 24, {
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

    const temperatures = daily.variables(0)!.valuesArray()
    const rain = daily.variables(1)!.valuesArray()

    const WEEK_DAYS = 7
    const weeklyData: WeeklyWeatherData[] = []

    for (let i = 0; i < weatherTimes.length; i += WEEK_DAYS) {
        const tempSlice = temperatures!.slice(i, i + WEEK_DAYS)
        const rainSlice = rain!.slice(i, i + WEEK_DAYS)

        const avgTemp = tempSlice.reduce((a, b) => a + b, 0) / (tempSlice.length || 1)

        const totalRain = rainSlice.reduce((a, b) => a + b, 0)

        weeklyData.push({
            aqi_pm: 0,
            country_code: "EGY",
            date: weatherTimes[i]?.toISOString().split("T")[0] ?? "",
            // flood_indicator: 0,
            // food_security_index: 0,
            // gdp_per_capita_usd: 0,
            // healthcare_access_index: 0,
            // heat_wave_days: 0, // for each country -> unique threshold
            latitude: response.latitude(),
            longitude: response.longitude(),
            pm25_ugm3: 0,
            precipitation_mm: Number(totalRain.toFixed(2)),
            temperature_celsius: Number(avgTemp.toFixed(2)),
        })
    }

    const mergedWeekly = weeklyAir.map((airWeek, i) => {
        const weatherWeek = weeklyData[i] || {}

        return {
            date: airWeek.date,
            pm2_5: airWeek.pm2_5,
            us_aqi_pm2_5: airWeek.us_aqi_pm2_5,
            temperature_celsius: weatherWeek.temperature_celsius ?? null,
            precipitation_mm: weatherWeek.precipitation_mm ?? null,
            latitude: airWeek.latitude, // or weatherWeek.latitude
            longitude: airWeek.longitude, // or weatherWeek.longitude
        }
    })

    return NextResponse.json({ weeklyData: mergedWeekly })
}
