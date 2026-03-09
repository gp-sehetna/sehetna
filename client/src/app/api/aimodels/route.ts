import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { MainService } from "@/shared/db/main.service"

export const GET = globalErrorHandler(async (_) => {
    const mainService = await MainService.getInstance()
    const aiModels = await mainService.aiModelService.findAll()
    return [{ data: aiModels }, "AI Models retrieved successfully"]
})

export const POST = globalErrorHandler(async (request) => {
    const aiModel = await request.json()

    const mainService = await MainService.getInstance()
    await mainService.aiModelService.createModel(aiModel)
    return [undefined, "New AI Model created successfully"]
})
