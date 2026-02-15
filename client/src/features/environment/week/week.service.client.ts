"use client"
import {
    EnvironmentData,
    GroupedHealthOutcome,
    Location,
} from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils"
import { confirmIncompleteEnvironment } from "@/lib/utils/toast"
import { api } from "@/shared/api"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"
import { toast } from "sonner"

export class WeekClientService {
    private getNullEnvironmentDataKeys(environmentData: EnvironmentData): string[] {
        const nullKeys = new Set<string>()

        // Check all weekly data rows
        for (const row of environmentData.data)
            for (const [key, value] of Object.entries(row))
                if (value === null) nullKeys.add(toProperCase(key))

        // Check all indicators dynamically
        for (const [key, value] of Object.entries(environmentData.indicators))
            if (value == null) nullKeys.add(toProperCase(key))

        return Array.from(nullKeys)
    }

    private fetchEnvironment = async ({ lat, lng, iso }: Location, date: string, weeks = 1) => {
        const coords = `${lat},${lng}`
        const searchParams: SearchParamsOption = { coords, iso, date, weeks }
        const environmentData = await api
            .get<EnvironmentData>("api/environment/week", { searchParams })
            .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data.length) {
            toast.error("No data found for this location", {
                description: "Please try another location or date.",
            })
            return null
        }

        // Check if any of the data objects keys is null and retreive this key for logging.
        const nullKeys = this.getNullEnvironmentDataKeys(environmentData)
        const result = await confirmIncompleteEnvironment(environmentData, nullKeys)
        if (result === null) return null

        // user chose "Continue Anyway"
        return result
    }

    private fetchEnvironmentAndSimulate = async (loc: Location, date: Date, weeks = 1) => {
        const environment = await this.fetchEnvironment(loc, format(date, "yyyy-MM-dd"), weeks)
        if (!environment) return null

        const { predictions } = await api
            .post<GroupedHealthOutcome>("ai/simulate", {
                json: environment,
                searchParams: { top_k_contributors: 3, explainer_method: "group" },
            })
            .json()
        return predictions
    }

    simulateEnvironment = (loc: Location, date: Date, weeks = 1) => {
        return toast.promise<GroupedHealthOutcome["predictions"] | null>(
            () => this.fetchEnvironmentAndSimulate(loc, date, weeks),
            {
                loading: "Loading...",
                success: (predictions) => {
                    if (!predictions)
                        return {
                            message: "Modify your inputs at the side bar to get predictions.",
                            type: "warning",
                        }

                    return { message: "Predictions loaded!", type: "info" }
                },
                error: "Error occurred",
            }
        )
    }
}
