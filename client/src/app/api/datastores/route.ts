import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { MainService } from "@/shared/db/main.service"

export const GET = globalErrorHandler(async (_) => {
    const mainService = await MainService.getInstance()
    const stores = await mainService.dataStoreService.findAll()
    return [{ data: stores }, "Data Stores retrieved successfully"]
})

export const POST = globalErrorHandler(async (request) => {
    const dataStore = await request.json()

    const mainService = await MainService.getInstance()
    const _id = await mainService.dataStoreService.createStore(dataStore)
    return [undefined, "New Data Store created successfully"]
})

export const DELETE = globalErrorHandler(async (request) => {
    const { id } = await request.json()

    const mainService = await MainService.getInstance()
    const isDeleted = await mainService.dataStoreService.deleteStore(id)

    if (!isDeleted) return [undefined, "Data Store not found"]

    return [undefined, "Data Store deleted successfully"]
})
