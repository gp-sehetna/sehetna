import { NextResponse } from "next/server"
import { fetchWeatherApi } from "openmeteo"

export const GET = async () => {
    const params = {
        latitude: 52.52,
        longitude: 13.41,
        start_date: "2026-01-06",
        end_date: "2026-01-12",
        daily: ["temperature_2m_mean", "rain_sum"],
        timezone: "auto",
    }

    const url = "https://archive-api.open-meteo.com/v1/archive"
    const responses = await fetchWeatherApi(url, params)
    const response = responses[0]

    const utcOffsetSeconds = response.utcOffsetSeconds()
    const daily = response.daily()!

    const times = Array.from(
        { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    )

    const temperatures = daily.variables(0)!.valuesArray()
    const rain = daily.variables(1)!.valuesArray()

    const WEEK_DAYS = 7
    const weeklyData = []

    for (let i = 0; i < times.length; i += WEEK_DAYS) {
        const tempSlice = temperatures!.slice(i, i + WEEK_DAYS)
        const rainSlice = rain!.slice(i, i + WEEK_DAYS)

        const avgTemp = tempSlice.reduce((a, b) => a + b, 0) / (tempSlice.length || 1)

        const totalRain = rainSlice.reduce((a, b) => a + b, 0)

        weeklyData.push({
            aqi_pm: 0,
            country_code: "EGY",
            date: times[i]?.toISOString().split("T")[0] ?? "",
            flood_indicator: 0,
            food_security_index: 0,
            gdp_per_capita_usd: 0,
            healthcare_access_index: 0,
            heat_wave_days: 0, // for each country -> unique threshold
            latitude: response.latitude(),
            longitude: response.longitude(),
            pm25_ugm3: 0,
            precipitation_mm: Number(totalRain.toFixed(2)),
            temperature_celsius: Number(avgTemp.toFixed(2)),
        })
    }

    return NextResponse.json(weeklyData)
}
