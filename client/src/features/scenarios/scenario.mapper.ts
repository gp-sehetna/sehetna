import { IObservation } from "@/shared/db/model/observation.model"
import { ScenarioObservation } from "./scenario.types"
import { ostring } from "zod/v3"

export function toScenarioObservation(observation: IObservation): ScenarioObservation {
    return {
        id: observation._id.toString(),
        baseDate: observation.base_date.toISOString(),
        locationName: observation.location_id?.name ?? null,
        healthOutcomes: observation.prediction_id?.health_outcomes ?? all,
        climate: {
            temperatureCelsius: observation.climate.temperature_celsius,
            precipitationMm: observation.climate.precipitation_mm,
            heatWaveDays: observation.climate.heat_wave_days,
            floodIndicator: observation.climate.flood_indicator,
        },

        airQuality: {
            pm25Ugm3: observation.air_quality.pm25_ugm3,
            aqiPm: observation.air_quality.aqi_pm,
        },

        healthIndicators: {
            gdpPerCapitaUsd: observation.health_indicators.gdp_per_capita_usd,
            foodProductionIndex: observation.health_indicators.food_production_index,
            undernourishment: observation.health_indicators.undernourishment,
        },

        note: observation.note,
    }
}
