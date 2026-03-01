import { CreateEmailOptions, Resend } from "resend"
import { ApplicationException, InternalServerException } from "@/shared/http/errors"
import logger from "@/shared/logger"
import { ContactUsDTO } from "@/features/engagements/engagements.dto"

interface EmailTemplate {
    id: string
    variables?: Record<string, string | number>
}

type SendEmailOptions = {
    to: string | string[]
    templateAlias: string
    variables?: EmailTemplate["variables"]
}
type ReceiveEmailOptions = {
    from: string
    text: string
}

export class EmailService {
    private readonly contactEmail = process.env.CONTACT_EMAIL as string
    private resend: Resend

    constructor() {
        const apiKey = process.env.MAIL_RESEND_API_KEY
        if (!apiKey)
            throw new InternalServerException("Missing MAIL_RESEND_API_KEY environment variable")
        this.resend = new Resend(apiKey)
    }

    private async sendEmail(emailData: CreateEmailOptions, errorMessage: string) {
        const { data, error } = await this.resend.emails.send(emailData)

        if (error)
            throw new ApplicationException(error.message || errorMessage, error.statusCode!, {
                name: error.name,
            })

        return data
    }

    async send({ to: _to, templateAlias, variables }: SendEmailOptions) {
        if (process.env.NODE_ENV !== "production") return

        const to = Array.isArray(_to) ? _to : [_to]
        const data = await this.sendEmail(
            { to, template: { id: templateAlias, variables } },
            "Email not sent, possibly due to poor network"
        )

        logger.info(`[EMAIL:${data.id}] sent to ${to.join(", ")}`)
    }

    async recieve({ from, text }: ReceiveEmailOptions) {
        if (process.env.NODE_ENV !== "production") return

        const data = await this.sendEmail(
            { from, to: this.contactEmail, subject: "New Contact Recieved - Sehetna", text },
            "Email not received, possibly due to poor network"
        )

        logger.info(`[EMAIL:${data.id}] sent from ${from} to ${this.contactEmail}`)
    }

    async sendWelcome(to: string) {
        await this.send({
            to,
            templateAlias: "welcome-message",
        })
    }

    async sendVerification(to: string, otp: string) {
        await this.send({
            to,
            templateAlias: "email-verification",
            variables: { OTP_CODE: otp },
        })
    }

    async sendPasswordChanged(to: string, timestamp: string, deviceName: string) {
        await this.send({
            to,
            templateAlias: "password-changed",
            variables: { timestamp, device_info: deviceName },
        })
    }

    async sendContact(contactUsObj: ContactUsDTO) {
        const text = `Name: ${contactUsObj.name}\nEmail: ${contactUsObj.email}\nPhone: ${contactUsObj.phone}\nMessage: ${contactUsObj.message}`
        await this.recieve({ from: this.contactEmail, text })
    }
}
