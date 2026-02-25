import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const POST = globalErrorHandler(async (request) => {
    const mainService = await MainService.getInstance()
    // const data = await mainService.forecastService
    return []
})
