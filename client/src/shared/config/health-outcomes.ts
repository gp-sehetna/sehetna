const DEFAULT_HEALTH_OUTCOME = "respiratory-disease-rate"

interface IHealthOutcomes {
    respiratory_disease_rate: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
    heat_related_admissions: number
}

const HEALTH_OUTCOMES = [
    "respiratory-disease-rate",
    "cardio-mortality-rate",
    "vector-disease-risk-score",
    "waterborne-disease-incidents",
    "heat-related-admissions",
]

export { DEFAULT_HEALTH_OUTCOME, HEALTH_OUTCOMES }
export type { IHealthOutcomes }
