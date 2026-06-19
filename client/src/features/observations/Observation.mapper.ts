import { IObservationPopulated } from "@/shared/db/model/observation.model"
import { FloodIndicator, ScenarioObservation } from "./Observation.types"
import { HealthOutcomePoints, IHealthOutcomes } from "@/shared/config/health-outcomes"

export function toScenarioObservation(observation: IObservationPopulated): any {
    return {
        id: observation._id.toString(),
        baseDate: observation.base_date.toISOString(),
        locationName: observation.location_id?.name ?? null,
        healthOutcomes: observation.prediction_id
            ? (Object.fromEntries(
                  Object.entries(observation.prediction_id.health_outcomes).map(([key, value]) => [
                      key,
                      value.point,
                  ])
              ) as HealthOutcomePoints)
            : null,
        climate: {
            temperatureCelsius: observation.climate.temperature_celsius,
            precipitationMm: observation.climate.precipitation_mm,
            heatWaveDays: observation.climate.heat_wave_days,
            floodIndicator: observation.climate.flood_indicator as 0 | 1 as FloodIndicator,
        },

        airQuality: {
            pm25Ugm3: observation.air_quality.pm25_ugm3,
            aqiPm: observation.air_quality.aqi_pm,
        },

        healthIndicators: {
            gdpPerCapitaUsd: observation.health_indicators.gdp_per_capita_usd,
            foodProductionIndex: observation.health_indicators.food_production_index,
        },

        note: observation.note,
    }
}
