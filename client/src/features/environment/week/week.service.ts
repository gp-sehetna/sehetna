import { MAP_CONFIG } from "@/components/ui/map/config"
import { EnvironmentData, WeeklyEnvironmentData } from "@/features/environment/week/week.types"
import { Alert, confirmMissingData } from "@/lib/alert"
import { api } from "@/shared/api"
import { SearchParamsOption } from "ky"

interface Prediction {
    respiratory_disease_rate: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
    heat_related_admissions: number
}

interface PredsRes {
    predictions: Prediction
}

export const weekService = {
    simulate: async (payload: EnvironmentData) => {
        const { predictions } = await api.post<PredsRes>("ai/simulate", { json: payload }).json()
        return predictions
    },
    fetchEnvironment: async (
        lat: number,
        lng: number,
        iso: string,
        date: string,
        endCount: number
    ) => {
        const coords = `${lat},${lng}`
        const searchParams: SearchParamsOption = { coords, iso, date, endCount }
        const environmentData = await api
            .get<EnvironmentData>("api/environment/week", { searchParams })
            .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data.length) {
            await Alert.popup.fire({ icon: "error", title: "No data found for this location" })
            return null
        }

        // Check if any of the data objects keys is null and retreive this key for logging.
        const keys = Object.keys(environmentData.data[0]) as Array<keyof WeeklyEnvironmentData>
        const nullKeys = keys
            .filter((key) => environmentData.data[0][key] === null)
            .map((key) => `data.${key}`)
        if (!environmentData.indicators.gdp_per_capita_usd)
            nullKeys.push("indicators.gdp_per_capita_usd")
        if (!environmentData.indicators.food_production_index)
            nullKeys.push("indicators.food_production_index")
        if (!environmentData.indicators.undernourishment)
            nullKeys.push("indicators.undernourishment")

        if (nullKeys) {
            const shouldContinue = await confirmMissingData(nullKeys)

            if (!shouldContinue) return null
        }

        return environmentData
    },

    fetchEnvironmentAndSimulate: async (
        lat: number,
        lng: number,
        iso: string,
        date: string,
        endCount: number
    ) => {
        const environment = await weekService.fetchEnvironment(lat, lng, iso, date, endCount)
        if (!environment) return null
        return await weekService.simulate(environment)
    },
    getCountriesPolygons: async () => {
        const geoJson = await api.get<any>(MAP_CONFIG.countriesPath).json()
        return geoJson
    },
}

/**
 * Example usage:
 *
 * const predictions = await weekService.fetchEnvironmentAndSimulate(
 *      e.lngLat.lat,
 *      e.lngLat.lng,
 *      "2023-04-01"
 *  )
 *
 *  if (!predictions) return
 *
 */
