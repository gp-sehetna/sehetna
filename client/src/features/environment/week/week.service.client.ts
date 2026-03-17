"use client"
import { Environment, IEnvironmentData } from "@/features/environment/week/week.dto"
import {
    Location,
    SimulateQueryParams,
    SimulateResponse,
} from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils"
import { confirmIncompleteEnvironment } from "@/lib/utils/toast"
import { api } from "@/shared/api"
import { MissingDataError } from "@/shared/http/errors"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"
import { toast } from "sonner"

export class WeekClientService {
    constructor(
        private setEnvironment: (_: IEnvironmentData | null) => void,
        private setModifying: (_: boolean) => void
    ) {}
    private getNullEnvironmentDataKeys(environmentData: IEnvironmentData): string[] {
        const nullKeys = new Set<string>()

        for (const row of environmentData.data)
            for (const [key, value] of Object.entries(row))
                if (value === null) nullKeys.add(toProperCase(key))

        if (!environmentData.indicators) nullKeys.add(toProperCase("indicators"))

        for (const [key, value] of Object.entries(environmentData.indicators ?? {}))
            if (value == null) nullKeys.add(toProperCase(key))

        return Array.from(nullKeys)
    }

    public fetchEnvironment = async (
        location: Location,
        date: string,
        weeks: number
    ): Promise<IEnvironmentData> => {
        const { lat, lng, iso } = location,
            coords = `${lat},${lng}`,
            isNotSimulation = !date || weeks == 0,
            searchParams: SearchParamsOption = isNotSimulation
                ? { coords, iso }
                : { coords, iso, date, weeks },
            environmentData = await api
                .get<IEnvironmentData | null>("api/environment/week", { searchParams })
                .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data?.length) {
            toast.error("No data found for this location", {
                description: "Modify your inputs or try another location/date.",
            })
            throw new MissingDataError(null)
        }

        this.setEnvironment(environmentData)
        // Check if any of the data objects keys is null and retreive this key for logging.
        const nullKeys = this.getNullEnvironmentDataKeys(environmentData)
        // If any of the data objects keys is null and this is not a simulation,
        // notify the user for intermediate action.
        if (!nullKeys.length || isNotSimulation) return environmentData

        const result = await confirmIncompleteEnvironment(environmentData)
        if (!result) throw new MissingDataError(environmentData)

        this.setModifying(true)
        return environmentData
    }

    private simulate = async (environment: IEnvironmentData, params: SimulateQueryParams) => {
        const result = await api
            .post<SimulateResponse>("ai/simulate", {
                json: environment,
                searchParams: { ...params },
            })
            .json()
        return result
    }

    simulateEnvironment = async (environment: IEnvironmentData, params: SimulateQueryParams) => {
        return await toast
            .promise<SimulateResponse>(() => this.simulate(environment, params), {
                loading: "Simulating...",
                success: () => {
                    return { message: "Predictions loaded!", type: "info" }
                },
                error: "Error occurred",
            })
            .unwrap()
    }

    fetchEnvironmentAndSimulate = async (
        loc: Location,
        date: Date,
        weeks: number,
        params: SimulateQueryParams
    ) => {
        return await toast
            .promise<SimulateResponse | null>(
                async () => {
                    const formattedDate = format(date, "yyyy-MM-dd")
                    try {
                        const environment = await this.fetchEnvironment(loc, formattedDate, weeks)
                        return await this.simulate(environment, params)
                    } catch (error) {
                        if (!(error instanceof MissingDataError)) throw error
                        this.setEnvironment(
                            error.err_details ?? new Environment(loc, formattedDate)
                        )
                        this.setModifying(true)
                        return null
                    }
                },
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
            .unwrap()
    }
}
