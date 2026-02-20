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
    keyof Prediction,
    ExplanationItemMap[Method][]
>

type ExplanationsByMethod = {
    [Method in ExplanationMethod]: ExplanationItems<Method>
}

type Explanations = {
    method: ExplanationMethod
} & ExplanationsByMethod

type SimulateResponse = {
    predictions: Prediction[]
    explanations: Explanations
}

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
    EnvironmentData,
    ExplanationItems,
    ExplanationMethod,
    Explanations,
    ExplanationsByMethod,
    GroupExplanationItem,
    Location,
    Prediction,
    Reducer,
    SimulateQueryParams,
    SimulateResponse,
    WaterfallItem,
    WeeklyEnvironmentData,
    WeekParams,
}
