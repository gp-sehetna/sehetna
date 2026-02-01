"use client"
import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { EmailInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { EmailSchema } from "@/features/auth/auth.validation"
import { hideEmail } from "@/lib/utils/email"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"

const ForgotPasswordPage = () => {
    const router = useRouter()

    const authService = useMemo(() => new AuthClientService(), [])
    const { register, handleSubmit, formState } = useForm<EmailInputsDTO>({
        resolver: zodResolver(EmailSchema),
        mode: "onSubmit",
    })

    const onSubmit = async (fields: EmailInputsDTO) => {
        await authService.checkEmail(fields)
        router.push(
            `/authenticate/verify?purpose=password_reset&mail=${encodeURIComponent(hideEmail(fields.email))}`
        )
    }

    return (
        <>
            <BaseAuthentication
                title={<h3>Forgot your password?</h3>}
                subtitle={
                    <p className="text-md text-neutral-600">
                        No problem, enter your email to find your account
                    </p>
                }
                onSubmit={handleSubmit(onSubmit)}
            >
                <Flex direction="col" gap={6}>
                    <AuthenticationField
                        label="Email Address"
                        id="forgot-password-email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        prependInnerIcon={<Mail />}
                        {...register("email")}
                        errors={[formState.errors.email]}
                    />
                    <WideButton type="submit" variant="black">
                        Continue
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default ForgotPasswordPage
