"use client"

import { Button } from "@/components/ui/shadcn/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn/field"
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/shadcn/input-group"
import { ContactUsDTO } from "@/features/engagements/engagements.dto"
import { EngagementsClientService } from "@/features/engagements/engagements.service.client"
import { ContactUsSchema } from "@/features/engagements/engagements.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const defaultValues: ContactUsDTO = {
    name: "",
    email: "",
    phone: "",
    message: "",
}

const ContactUsForm = () => {
    const engagementsService = useMemo(() => new EngagementsClientService(), [])

    const { register, handleSubmit, reset, formState } = useForm<ContactUsDTO>({
        resolver: zodResolver(ContactUsSchema),
        mode: "onSubmit",
        defaultValues,
    })

    const onSubmit = async (fields: ContactUsDTO) => {
        const message = await engagementsService.sendContactUs(fields)

        toast.success(message)
        reset(defaultValues)
    }

    return (
        <section className="mx-auto w-full max-w-3xl px-6 py-24">
            <div className="mb-8 space-y-2 text-center">
                <h1 className="text-3xl font-semibold">Contact Us</h1>
                <p className="text-muted-foreground">
                    Send us your message and our team will get back to you.
                </p>
            </div>

            <form
                className="glassy space-y-5 rounded-2xl p-6"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <Field className="gap-1">
                    <FieldLabel required htmlFor="contact-name">
                        Name
                    </FieldLabel>
                    <InputGroup rounded="xxl">
                        <InputGroupInput
                            id="contact-name"
                            type="text"
                            placeholder="Enter your name"
                            required
                            {...register("name")}
                        />
                    </InputGroup>
                    <FieldError errors={[formState.errors.name]} />
                </Field>

                <Field className="gap-1">
                    <FieldLabel required htmlFor="contact-email">
                        Email
                    </FieldLabel>
                    <InputGroup rounded="xxl">
                        <InputGroupInput
                            id="contact-email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            {...register("email")}
                        />
                    </InputGroup>
                    <FieldError errors={[formState.errors.email]} />
                </Field>

                <Field className="gap-1">
                    <FieldLabel htmlFor="contact-phone">Phone Number</FieldLabel>
                    <InputGroup rounded="xxl">
                        <InputGroupInput
                            id="contact-phone"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            {...register("phone")}
                        />
                    </InputGroup>
                    <FieldError errors={[formState.errors.phone]} />
                </Field>

                <Field className="gap-1">
                    <FieldLabel required htmlFor="contact-message">
                        Message
                    </FieldLabel>
                    <InputGroup rounded="xxl">
                        <InputGroupTextarea
                            id="contact-message"
                            rows={6}
                            placeholder="Write your message"
                            required
                            {...register("message")}
                        />
                    </InputGroup>
                    <FieldError errors={[formState.errors.message]} />
                </Field>

                <Button
                    type="submit"
                    variant="black"
                    className="w-full rounded-full py-5"
                    disabled={formState.isSubmitting}
                >
                    {formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </section>
    )
}

export default ContactUsForm
