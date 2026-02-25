import { ContactUsDTO } from "./engagements.dto"

export class EngagementsService {
    async sendContact({ name, email, phone, message }: ContactUsDTO) {}
}
