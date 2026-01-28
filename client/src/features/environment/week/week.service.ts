import { MAP_CONFIG } from "@/components/ui/map/config"
import { EnvironmentData, WeeklyEnvironmentData } from "@/features/environment/week/week.types"
import { api, externalApi } from "@/shared/api"
import { OPENCAGE_GEOCODE, WORLDBANK } from "@/shared/config/urls"
import { BadRequestException } from "@/shared/http/errors"
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

export const weekServiceHelpers = {
    fetchIndicators: async (CC: string, year: number): Promise<Array<number | null>> => {
        const url = `${WORLDBANK}/countries/${CC}/indicators`
        const searchParams: SearchParamsOption = { format: "json", date: year.toString() }

        const gdpPerCapitaData: Array<any> = await externalApi
            .get(`${url}/NY.GDP.PCAP.CD`, { searchParams })
            .json()
        const foodProductionData: Array<any> = await externalApi
            .get(`${url}/AG.PRD.FOOD.XD`, { searchParams })
            .json()
        const undernourishmentData: Array<any> = await externalApi
            .get(`${url}/SN.ITK.DEFC.ZS`, { searchParams })
            .json()

        const [gdpPerCapita, foodProductionIndex, undernourishment] = [
            gdpPerCapitaData[1]?.[0] ?? null,
            foodProductionData[1]?.[0] ?? null,
            undernourishmentData[1]?.[0] ?? null,
        ]

        return [gdpPerCapita?.value, foodProductionIndex?.value, undernourishment?.value]
    },
    fetchCountryCode: async (lat: number, lng: number) => {
        const searchParams: SearchParamsOption = {
            q: `${lat}+${lng}`,
            key: process.env.OPENCAGE_KEY,
        }
        const { results }: { results: Array<any> } = await externalApi
            .get(OPENCAGE_GEOCODE, { searchParams })
            .json()

        const countryCode: string = results[0].components["ISO_3166-1_alpha-3"]
        if (!countryCode)
            throw new BadRequestException(
                "Invalid coordinates: country code not found using these coordinates",
                { coords: `${lat},${lng}` }
            )

        return countryCode
    },
}

export const weekService = {
    simulate: async (payload: EnvironmentData) => {
        const { predictions } = await api.post<PredsRes>("ai/simulate", { json: payload }).json()
        return predictions
    },
    fetchEnvironment: async (lat: number, lng: number, date: string) => {
        const coords = `${lat},${lng}`
        const searchParams: SearchParamsOption = { coords, date }
        const environmentData = await api
            .get<EnvironmentData>("api/environment/week", { searchParams })
            .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data.length)
            return { code: "ENVIRONMENT_NOT_FOUND", data: null } as const

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

        if (nullKeys) return { code: "MISSING_DATA", data: nullKeys } as const

        return { code: "SUCCESS", data: environmentData } as const
    },
    getCountriesPolygons: async () => {
        const geoJson = await api.get<any>(MAP_CONFIG.countriesPath).json()
        return geoJson
    },
}

/**
 * Example usage:
 *
 *  import { Alert, confirmMissingData } from "@/lib/alert"
 *
 *  const { code, data } = await weekService.fetchEnvironment(e.lngLat.lat, e.lngLat.lng, "2023-04-01")
 *
 *  if (code != "SUCCESS") return data
 *  if (code == "ENVIRONMENT_NOT_FOUND") {
 *      await Alert.popup.fire({ icon: "error", title: "No data found for this location" })
 *      return
 *  }
 *
 *  if (code == "MISSING_DATA") {
 *      const shouldContinue = await confirmMissingData(nullKeys)
 *      if (!shouldContinue) return null
 *  }
 *
 *  const predictions = await weekService.simulate(data)
 *
 *  if (!predictions) return
 *
 */
