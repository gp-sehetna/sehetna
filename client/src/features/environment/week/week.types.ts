import { IHealthOutcomes } from "@/shared/config/health-outcomes"

type Reducer = (values: number[]) => number | null
type AggResult<T> = { date: string } & { [K in keyof T]: number | null }

type WeekParams = {
    loc: Location
    date: Date
    weeks: number
    endDate: Date
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

interface GroupExplanationItem {
    group: string
    shap_sum?: number
    abs_shap_sum?: number
    percent: number
}

interface CumulativeExplanationItem {
    feature: string
    shap: number
    from: number
    to: number
    direction: "Increase" | "Decrease"
}

type ExplanationItemMap = {
    group: GroupExplanationItem
    cumulative: CumulativeExplanationItem
}

type ExplanationItems<Method extends ExplanationMethod> = Record<
    keyof IHealthOutcomes,
    ExplanationItemMap[Method][]
>

type ExplanationsByMethod = {
    [Method in ExplanationMethod]: ExplanationItems<Method>
}

type Explanations = {
    method: ExplanationMethod
} & ExplanationsByMethod

type PredictionsResponse = {
    predictions: IHealthOutcomes[]
}

type SimulateResponse = {
    explanations: Explanations
} & PredictionsResponse

type ExplanationMethod = "cumulative" | "group"
interface SimulateQueryParams {
    top_k_contributions: number
    explainer_method: ExplanationMethod
}

interface Coordinates {
    lat: number
    lng: number
}

interface WaterfallItem extends CumulativeExplanationItem {
    base: number
    value: number
    isLast: boolean
}

const HEAT_WAVE_DAY_THRESHOLD = 28
const PRECIPITATION_THRESHOLD = 132.5 // Precipitation in mm ranges between 0-200+

export { HEAT_WAVE_DAY_THRESHOLD, PRECIPITATION_THRESHOLD }
export type {
    AggResult,
    Coordinates,
    CumulativeExplanationItem,
    ExplanationItems,
    ExplanationMethod,
    Explanations,
    ExplanationsByMethod,
    GroupExplanationItem,
    Location,
    Reducer,
    SimulateQueryParams,
    SimulateResponse,
    WaterfallItem,
    WeeklyEnvironmentData,
    WeekParams,
}
