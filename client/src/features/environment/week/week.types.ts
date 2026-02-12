import { Coordinates } from "@/shared/types/map"

type Reducer = (values: number[]) => number | null
type AggResult<T> = { date: string } & { [K in keyof T]: number | null }

type WeekParams = {
    loc: Location
    date: string
    weeks: number
}

interface Location extends Coordinates {
    iso: string
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

interface Prediction {
    respiratory_disease_rate: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
    heat_related_admissions: number
}

type GroupExplanationItem = {
  group: string
  shap_sum: number
  abs_shap_sum: number
  percent: number
}

type GroupedByPrediction = {
    [K in keyof Prediction]: GroupExplanationItem[]
}

type Explanation = {
  method: "group"
  group: GroupedByPrediction
}

type GroupedHealthOutcome = {
  predictions: Prediction & {
    explanations: Explanation
  }
}


interface SimulateResponse {
    predictions: Prediction
}

const HEAT_WAVE_DAY_THRESHOLD = 28
const PRECIPITATION_THRESHOLD = 132.5 // Precipitation in mm ranges between 0-200+

export { HEAT_WAVE_DAY_THRESHOLD, PRECIPITATION_THRESHOLD }
export type {
    AggResult,
    EnvironmentData,
    Location,
    Prediction,
    Reducer,
    SimulateResponse,
    WeeklyEnvironmentData,
    WeekParams,
    GroupedHealthOutcome,
    GroupExplanationItem
}
