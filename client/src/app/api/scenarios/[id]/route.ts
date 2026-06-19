import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const DELETE = globalErrorHandler(
    async (_request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const mainService = await MainService.getInstance()
        const isDeleted = await mainService.observationService.deleteObservation(id)

        if (!isDeleted) {
            return [undefined, "Scenario observation not found"]
        }

        return [undefined, "Scenario observation deleted successfully"]
    }
)

// TODO: This endpoint needs to be handled from the client (READY FOR USE YA BODAAA BEH !!!)
export const POST = globalErrorHandler(
    async (request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params
        const { note } = (await request.json()) as { note?: string }
        const mainService = await MainService.getInstance()
        const isSaved = await mainService.observationService.updateNote(id, note ?? "")

        if (!isSaved) {
            return [undefined, "Scenario observation not found"]
        }

        return [undefined, "Scenario observation note saved successfully"]
    }
)
