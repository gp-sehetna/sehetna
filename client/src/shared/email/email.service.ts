import { Resend } from "resend"
import { ApplicationException, InternalServerException } from "@/shared/http/errors"
import logger from "@/shared/logger"

interface EmailTemplate {
    id: string
    variables?: Record<string, string | number>
}

type SendEmailOptions = {
    to: string | string[]
    templateAlias: string
    variables?: EmailTemplate["variables"]
}

export class EmailService {
    private resend: Resend

    constructor() {
        const apiKey = process.env.MAIL_RESEND_API_KEY
        if (!apiKey)
            throw new InternalServerException("Missing MAIL_RESEND_API_KEY environment variable")
        this.resend = new Resend(apiKey)
    }

    async send({ to: _to, templateAlias, variables }: SendEmailOptions) {
        if (process.env.NODE_ENV !== "production") return

        const to = Array.isArray(_to) ? _to : [_to]
        const { data, error } = await this.resend.emails.send({
            to,
            template: { id: templateAlias, variables },
        })

        if (error)
            throw new ApplicationException(
                error.message || "Email not sent, possibly due to poor network",
                error.statusCode!,
                { name: error.name }
            )

        logger.info(`[EMAIL:${data.id}] sent to ${to.join(", ")}`)
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
}
