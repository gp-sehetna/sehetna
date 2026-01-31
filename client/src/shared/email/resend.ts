import { Resend } from "resend"
import { InternalServerException } from "../http/errors"

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
        if (!apiKey) throw new InternalServerException("MAIL_RESEND_API_KEY is missing")
        this.resend = new Resend(apiKey)
    }

    async send({ to, templateAlias, variables }: SendEmailOptions) {
        const { data, error } = await this.resend.emails.send({
            to: Array.isArray(to) ? to : [to],
            template: {
                id: templateAlias,
                variables,
            },
        })

        if (error)
            throw new InternalServerException("Email not sent, possibly due to poor network", error)

        return data
    }

    sendWelcome(to: string) {
        return this.send({
            to,
            templateAlias: "welcome-message",
        })
    }

    sendVerification(to: string, otp: string) {
        return this.send({
            to,
            templateAlias: "email-verification",
            variables: { otp_code: otp },
        })
    }
}
