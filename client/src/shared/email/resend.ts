import { Resend } from "resend"
import { InternalServerException } from "../http/errors"

interface EmailTemplate {
    id: string
    variables?: Record<string, string | number>
}

type SendEmailOptions = {
    to: string | string[]
    templateId: string
    variables?: EmailTemplate["variables"]
}

export class EmailService {
    private resend: Resend

    constructor() {
        const apiKey = process.env.MAIL_RESEND_API_KEY
        if (!apiKey) throw new InternalServerException("MAIL_RESEND_API_KEY is missing")
        this.resend = new Resend(apiKey)
    }

    private async getTemplate(
        templateId: string,
        variables?: EmailTemplate["variables"]
    ): Promise<EmailTemplate> {
        try {
            const templateResponse = await this.resend.templates.get(templateId)
            const data = templateResponse as unknown as EmailTemplate

            return {
                id: data.id,
                variables,
            }
        } catch (error) {
            throw new InternalServerException(`Failed to load email template: ${templateId}`, error)
        }
    }

    async send({ to, templateId, variables }: SendEmailOptions) {
        const template = await this.getTemplate(templateId, variables)

        const { data, error } = await this.resend.emails.send({
            to: Array.isArray(to) ? to : [to],
            template,
        })

        if (error)
            throw new InternalServerException("Email not sent, possibly due to poor network", error)

        return data
    }

    sendWelcome(to: string) {
        return this.send({
            to,
            templateId: "welcome-message",
        })
    }

    sendVerification(to: string, otp: string) {
        return this.send({
            to,
            templateId: "email-verification",
            variables: { otp_code: otp },
        })
    }
}
