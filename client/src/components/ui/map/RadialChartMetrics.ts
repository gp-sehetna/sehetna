import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { Activity, HeartPulse, AlertTriangle, Droplets, Thermometer } from "lucide-react"

export const HEALTH_METRIC_ICONS: Record<(typeof HEALTH_OUTCOMES_KEYS)[number], any> = {
    respiratory_disease_rate: Activity,
    cardio_mortality_rate: HeartPulse,
    vector_disease_risk_score: AlertTriangle,
    waterborne_disease_incidents: Droplets,
    heat_related_admissions: Thermometer,
}
