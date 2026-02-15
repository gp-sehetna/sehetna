"use client"
import { EnvironmentData, Location, SimulateResponse } from "@/features/environment/week/week.types"
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

    private fetchEnvironment = async (location: Location, date: string | null, weeks: number) => {
        const { lat, lng, iso } = location,
            coords = `${lat},${lng}`,
            isNotSimulation = !date || weeks == 0,
            searchParams: SearchParamsOption = isNotSimulation
                ? { coords, iso }
                : { coords, iso, date, weeks },
            environmentData = await api
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
        // If any of the data objects keys is null and this is not a simulation,
        // notify the user for intermediate action.
        if (!nullKeys.length || isNotSimulation) return environmentData

        const result = await confirmIncompleteEnvironment(environmentData)
        if (result === null) return null // user chose "Modify"

        return environmentData
    }

    private fetchEnvironmentAndSimulate = async (loc: Location, date?: Date, weeks = 0) => {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : null
        const environment = await this.fetchEnvironment(loc, formattedDate, weeks)
        if (!environment) return null

        const result = await api
            .post<SimulateResponse>("ai/simulate", {
                json: environment,
                searchParams: { top_k_contributors: 3, explainer_method: "group" },
            })
            .json()
        return result
    }

    simulateEnvironment = (loc: Location, date: Date, weeks = 1) => {
        return toast.promise<SimulateResponse | null>(
            () => this.fetchEnvironmentAndSimulate(loc, date, weeks),
            {
                loading: "Simulating...",
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
