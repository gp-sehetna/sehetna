import { slugify } from "@/lib/utils"

const HEALTH_OUTCOMES_KEYS = [
    "respiratory_disease_rate",
    "cardio_mortality_rate",
    "vector_disease_risk_score",
    "waterborne_disease_incidents",
    "heat_related_admissions",
] as const

type HealthOutcomeDbKey = (typeof HEALTH_OUTCOMES_KEYS)[number]

type IHealthOutcomes<T = number> = Record<HealthOutcomeDbKey, T>

const HEALTH_OUTCOMES_WITH_HYPHEN = HEALTH_OUTCOMES_KEYS.map((key) => slugify(key))
const DEFAULT_HEALTH_OUTCOME = HEALTH_OUTCOMES_WITH_HYPHEN[0]

const mapHealthOutcomes = <T>(factory: (key: HealthOutcomeDbKey) => T) =>
    Object.fromEntries(HEALTH_OUTCOMES_KEYS.map((key) => [key, factory(key)])) as Record<
        HealthOutcomeDbKey,
        T
    >

export {
    DEFAULT_HEALTH_OUTCOME,
    HEALTH_OUTCOMES_KEYS,
    HEALTH_OUTCOMES_WITH_HYPHEN,
    mapHealthOutcomes,
}
export type { HealthOutcomeDbKey, IHealthOutcomes }
