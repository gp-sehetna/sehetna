import {
    deleteMockScenarioObservation,
    saveMockScenarioObservationNote,
} from "@/features/scenarios/scenario.mock"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const DELETE = globalErrorHandler(
    async (_request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const isDeleted = deleteMockScenarioObservation(id)

        if (!isDeleted) return [undefined, "Scenario observation not found"]

        return [undefined, "Scenario observation deleted successfully"]
    }
)

export const POST = globalErrorHandler(
    async (request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const { note } = (await request.json()) as { note?: string }
        const isSaved = saveMockScenarioObservationNote(id, note ?? "")

        if (!isSaved) return [undefined, "Scenario observation not found"]

        return [undefined, "Scenario observation note saved successfully"]
    }
)
