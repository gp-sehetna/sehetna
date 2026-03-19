import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const DELETE = globalErrorHandler(
    async (_req, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params

        const mainService = await MainService.getInstance()
        const isDeleted = await mainService.aiModelService.deleteModel(id)

        if (!isDeleted) return [undefined, "AI Model not found"]

        return [undefined, "AI Model deleted successfully"]
    }
)
