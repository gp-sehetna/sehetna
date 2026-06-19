
import { ObservationService } from "@/features/observations/Observation.service"
import { ObservationModel } from "@/shared/db/model/observation.model"
import { ObservationRepository } from "@/shared/db/repository/observation.repository"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const DELETE = globalErrorHandler(
    async (_request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const observation = new ObservationService(new ObservationRepository(ObservationModel))
        const isDeleted = await observation.deleteObservation(id)

        if (!isDeleted) {
            return [undefined, "Scenario observation not found"]
        }

        return [undefined, "Scenario observation deleted successfully"]
    }
)

export const POST = globalErrorHandler(
    async (request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const { note } = (await request.json()) as { note?: string }
        const observation = new ObservationService(new ObservationRepository(ObservationModel))

        const isSaved = await observation.updateNote(
            id,
            note ?? ""
        )

        if (!isSaved) {
            return [undefined, "Scenario observation not found"]
        }

        return [undefined, "Scenario observation note saved successfully"]
    }
)
