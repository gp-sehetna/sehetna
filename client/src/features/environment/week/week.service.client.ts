"use client"
import { EnvironmentData, Location } from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils"
import { confirmIncompleteEnvironment } from "@/lib/utils/toast"
import { api } from "@/shared/api"
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

    public fetchEnvironment = async (location: Location, date: string | null, weeks: number) => {
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
}
