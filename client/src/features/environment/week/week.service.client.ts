"use client"
import { Alert, confirmMissingData } from "@/lib/alert"
import { formatDate } from "@/lib/utils/date"
import { api } from "@/shared/api"
import { SearchParamsOption } from "ky"
import {
    EnvironmentData,
    WeeklyEnvironmentData,
    SimulateResponse,
    Location,
} from "@/features/environment/week/week.types"

export class WeekClientService {
    fetchEnvironment = async ({ lat, lng, iso }: Location, date: string, weeks = 1) => {
        const coords = `${lat},${lng}`
        const searchParams: SearchParamsOption = { coords, iso, date, weeks }
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
            // Alert the user about missing data and confirm if they want to continue.
            const shouldContinue = await confirmMissingData(nullKeys)

            if (!shouldContinue) return null
        }

        return environmentData
    }

    fetchEnvironmentAndSimulate = async (loc: Location, date: Date, weeks = 1) => {
        const environment = await this.fetchEnvironment(loc, formatDate(date), weeks)
        if (!environment) return null

        const { predictions } = await api
            .post<SimulateResponse>("ai/simulate", { json: environment })
            .json()
        return predictions
    }
}
