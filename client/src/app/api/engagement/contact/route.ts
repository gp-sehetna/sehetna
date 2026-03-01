import { ContactUsDTO } from "@/features/engagements/engagements.dto"
import { ContactUsSchema } from "@/features/engagements/engagements.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const POST = globalErrorHandler(async (request) => {
    const contactData: ContactUsDTO = await request.json()

    const { name, email, phone, message } = contactData

    const query = ContactUsSchema.parse({ name, email, phone, message })

    const mainService = await MainService.getInstance()
    await mainService.engagementService.sendContact(query)

    return [undefined, "Contact us form submitted successfully"]
})
