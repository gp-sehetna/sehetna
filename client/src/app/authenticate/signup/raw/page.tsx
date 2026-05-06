"use client"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { FormInputField } from "@/components/ui/forms/inputs/FormInputField"
import { EmailInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { EmailSchema } from "@/features/auth/auth.validation"
import { hideEmail } from "@/lib/utils/email"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"

const SignupRawPage = () => {
    const router = useRouter()

    const authService = useMemo(() => new AuthClientService(), [])
    const { register, handleSubmit, formState } = useForm<EmailInputsDTO>({
        resolver: zodResolver(EmailSchema),
        mode: "onSubmit",
    })

    const onSubmit = async (fields: EmailInputsDTO) => {
        await authService.generateAndFetchOtp(fields)
        router.push(
            `/authenticate/verify?purpose=${PurposeEnum.emailVerification}&mail=${encodeURIComponent(hideEmail(fields.email))}`
        )
    }

    return (
        <BaseAuthentication
            title={<h3>Create your account</h3>}
            subtitle={
                <p className="text-md text-neutral-600">Enter your email address and verify it</p>
            }
            onSubmit={handleSubmit(onSubmit)}
        >
            <Flex direction="col" gap={6}>
                <FormInputField
                    label="Email Address"
                    type="email"
                    placeholder="abc@example.com"
                    prependInnerIcon={<Mail />}
                    {...register("email")}
                    errors={[formState.errors.email]}
                />
                <WideButton type="submit" variant="black" disabled={formState.isSubmitting}>
                    Verify Email
                </WideButton>
            </Flex>

            <Flex direction="col" gap={4}>
                <p className="text-xs">Already have an account?</p>
                <WideButton asChild size="lg" variant="outline">
                    <Link href="/authenticate/login">
                        <LogIn />
                        Log In
                    </Link>
                </WideButton>
            </Flex>
        </BaseAuthentication>
    )
}

export default SignupRawPage
