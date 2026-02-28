"use client"

import { ContactUsDTO } from "@/features/engagements/engagements.dto"
import { api } from "@/shared/api"

type ContactUsResponse = {
    message: string
}

export class EngagementsClientService {
    sendContactUs = async (json: ContactUsDTO) => {
        const { message } = await api
            .post<ContactUsResponse>("api/engagement/contact", { json })
            .json()

        return message
    }
}
