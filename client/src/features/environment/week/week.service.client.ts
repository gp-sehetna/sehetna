"use client"
import { Environment, IEnvironmentData } from "@/features/environment/week/week.dto"
import {
    Location,
    SimulateQueryParams,
    SimulateResponse,
} from "@/features/environment/week/week.types"
import { scenarioClientService } from "@/features/observations/Observation.service.client"
import storageKeys from "@/lib/storage"
import { toProperCase } from "@/lib/utils"
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

    public getEnvironment = async (
        location: Location,
        date: Date,
        weeks: number
    ): Promise<IEnvironmentData> => {
        const formattedDate = format(date, "yyyy-MM-dd")
        const { lat, lng, iso } = location,
            coords = `${lat},${lng}`,
            isNotSimulation = !formattedDate || weeks == 0,
            searchParams: SearchParamsOption = isNotSimulation
                ? { coords, iso }
                : { coords, iso, date: formattedDate, weeks },
            environmentData = await api
                .get<IEnvironmentData | null>("api/environment/week", { searchParams })
                .json()

        // Validate Environment Data
        if (!environmentData || !environmentData.data?.length) {
            toast.error("No data found for this location", {
                description: "Modify your inputs or try another location/date.",
            })
            throw new MissingDataError(null)
        }
        this.setEnvironment(environmentData)
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

    _getSaveScenario = () => {
        return localStorage.getItem(storageKeys.saveScenario) === "true" || false
    }

    simulateEnvironment = async (environment: IEnvironmentData, params: SimulateQueryParams) => {
        return await toast
            .promise<SimulateResponse>(
                async () => {
                    const simulationResult = await this.simulate(environment, params)
                    const prediction = simulationResult.predictions[0]
                    const isSaveScenario = this._getSaveScenario()
                    // TODO: ensure to check the correct value of `date` the is sent to save Scenario
                    if (isSaveScenario)
                        await scenarioClientService.saveScenario(environment, prediction)
                    return simulationResult
                },
                {
                    loading: "Simulating...",
                    success: () => {
                        return { message: "Predictions loaded!", type: "info" }
                    },
                    error: "Error occurred",
                }
            )
            .unwrap()
    }

    fetchEnvironmentWithToast = async (loc: Location, date: Date, weeks: number) => {
        return await toast
            .promise(
                async () => {
                    try {
                        await this.getEnvironment(loc, date, weeks)
                    } catch (error) {
                        if (!(error instanceof MissingDataError)) throw error
                        this.setEnvironment(error.err_details ?? new Environment(loc, date))
                        return null
                    }
                },
                {
                    loading: "Extracting environment...",
                    success: () => {
                        this.setModifying(true)
                        return {
                            message: "Modify your inputs at the side bar to get predictions.",
                            type: "warning",
                        }
                    },
                    error: "Error occurred",
                }
            )
            .unwrap()
    }
}
