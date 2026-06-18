import { slugify } from "@/lib/utils"

const HEALTH_OUTCOMES_KEYS = [
    "respiratory_disease_rate",
    "cardio_mortality_rate",
    "vector_disease_risk_score",
    "waterborne_disease_incidents",
    "heat_related_admissions",
] as const

type _Slugify<S extends string> = S extends `${infer T}_${infer U}` ? `${T}-${_Slugify<U>}` : S
type _MapSlugs<T extends readonly string[]> = {
    [K in keyof T]: T[K] extends string ? _Slugify<T[K]> : T[K]
}

type HealthOutcomesKeys = (typeof HEALTH_OUTCOMES_KEYS)[number]
type IHealthOutcomes<T = number> = Record<HealthOutcomesKeys, T>

const HEALTH_OUTCOMES_WITH_HYPHEN = HEALTH_OUTCOMES_KEYS.map((key) =>
    slugify(key)
) as unknown as _MapSlugs<typeof HEALTH_OUTCOMES_KEYS>

const DEFAULT_HEALTH_OUTCOME = HEALTH_OUTCOMES_KEYS[0]

export type HealthOutcomePoints = {
    cardio_mortality_rate: number
    heat_related_admissions: number
    respiratory_disease_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
}

const mapHealthOutcomes = <T>(factory: (key: HealthOutcomesKeys) => T) =>
    Object.fromEntries(HEALTH_OUTCOMES_KEYS.map((key) => [key, factory(key)])) as Record<
        HealthOutcomesKeys,
        T
    >

export {
    DEFAULT_HEALTH_OUTCOME,
    HEALTH_OUTCOMES_KEYS,
    HEALTH_OUTCOMES_WITH_HYPHEN,
    mapHealthOutcomes,
}
export type { HealthOutcomesKeys, IHealthOutcomes }
