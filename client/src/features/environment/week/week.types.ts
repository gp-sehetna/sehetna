type Reducer = (values: number[]) => number | null
type AggResult<T> = { date: string } & { [K in keyof T]: number | null }

type QueryParams = {
    lat: number
    lng: number
    iso: string
    date: string
    endCount: number
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

interface EnvironmentData {
    coords: string
    country_code: string
    indicators: {
        gdp_per_capita_usd: number | null
        food_production_index: number | null
        undernourishment: number | null
    }
    data: Array<WeeklyEnvironmentData>
}

const HEAT_WAVE_DAY_THRESHOLD = 28
const PRECIPITATION_THRESHOLD = 132.5 // Precipitation in mm ranges between 0-200+

export { HEAT_WAVE_DAY_THRESHOLD, PRECIPITATION_THRESHOLD }
export type { AggResult, EnvironmentData, QueryParams, Reducer, WeeklyEnvironmentData }
