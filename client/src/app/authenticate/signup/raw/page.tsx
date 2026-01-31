"use client"
import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { LogIn, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { hideEmail } from "@/lib/utils/email"
import { EmailSchema } from "@/features/auth/auth.validation"
import { EmailInputsDTO } from "@/features/auth/auth.dto"

const SignupRawPage = () => {
    const router = useRouter()
    const { register, handleSubmit, formState } = useForm<EmailInputsDTO>({
        resolver: zodResolver(EmailSchema),
        mode: "onSubmit",
    })

    function onSubmit({ email }: EmailInputsDTO) {
        // TODO: Call endpoint to store email address in server cookies
        router.push(
            `/authenticate/verify?purpose=password_reset&mail=${encodeURIComponent(hideEmail(email))}`
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
                <AuthenticationField
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
