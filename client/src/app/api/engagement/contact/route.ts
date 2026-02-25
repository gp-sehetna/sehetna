import { ContactUsSchema } from "@/features/engagements/engagements.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const POST = globalErrorHandler(async (request) => {
    const formData = await request.formData()

    const query = ContactUsSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    })

    const mainService = await MainService.getInstance()
    const data = await mainService.weekService.getWeeklyEnvironmentData(query)

    return [undefined, "Contact us form submitted successfully"]
})
