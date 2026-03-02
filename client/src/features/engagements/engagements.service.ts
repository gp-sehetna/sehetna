import { EngagementRepository } from "@/shared/db/repository/engagement.repository"
import { EmailService } from "@/shared/email/email.service"
import { ContactUsDTO } from "./engagements.dto"

export class EngagementsService {
    constructor(
        private readonly engagementRepository: EngagementRepository,
        private readonly emailService: EmailService
    ) {
        this.emailService = emailService
    }
    async sendContact(contactUsObj: ContactUsDTO) {
        const { name, email, phone, message } = contactUsObj
        // Create a db transaction here
        await this.engagementRepository.create({ name, email, phone, message })
        await this.emailService.sendContact(contactUsObj)
        //-----------------------------
    }
}
