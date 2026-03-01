import { EmailService } from "@/shared/email/email.service"
import { ContactUsDTO } from "./engagements.dto"
import { EngagementRepository } from "@/shared/db/repository/engagement.repository"
import { EngagementModel } from "@/shared/db/model/contact.model"

export class EngagementsService {
    private readonly engagementRepository = new EngagementRepository(EngagementModel)
    private readonly emailService
    constructor(emailService: EmailService) {
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
