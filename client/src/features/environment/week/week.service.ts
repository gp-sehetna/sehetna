import { EnvironmentData, WeeklyEnvironmentData } from "@/features/environment/week/week.types"
import { api, externalApi } from "@/shared/api"
import { OPENCAGE_GEOCODE, WORLDBANK } from "@/shared/config/urls"
import { BadRequestException } from "@/shared/http/errors"
import logger from "@/shared/logger"
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

        try {
            // Validate Environment Data and ensure non-null values.
            if (!environmentData || !environmentData.data.length)
                throw new BadRequestException("No data found for this location.")
            if (!environmentData.indicators.gdp_per_capita_usd)
                throw new BadRequestException("No GDP per capita data found for this location.")
            if (!environmentData.indicators.food_production_index)
                throw new BadRequestException(
                    "No food production index data found for this location."
                )
            if (!environmentData.indicators.undernourishment)
                throw new BadRequestException("No undernourishment data found for this location.")

            // Check if any of the data objects keys is null and retreive this key for logging.
            const keys = Object.keys(environmentData.data[0]) as Array<keyof WeeklyEnvironmentData>
            const nullKeys = keys.filter((key) => environmentData.data[0][key] === null)
            if (nullKeys)
                throw new BadRequestException("Some data is missing for this location.", {
                    keys: nullKeys,
                })
        } catch (error) {
            if (!(error instanceof BadRequestException)) throw new Error("Unexpected error")

            // Use a toast to show the error message
            logger.info(error.message)
        }

        return environmentData
    },

    fetchEnvironmentAndSimulate: async (lat: number, lng: number, date: string) => {
        const environment = await weekService.fetchEnvironment(lat, lng, date)
        return await weekService.simulate(environment)
    },
}
