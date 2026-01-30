import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { Mail } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your Sehetna account password by entering your email address.",
}

const ForgotPasswordPage = () => {
    const title = <h3>Forgot your password?</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">
            No problem, enter your email to find your account
        </p>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={6}>
                    <AuthenticationField
                        name="Email Address"
                        id="forgot-password-email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        prependInnerIcon={<Mail />}
                    />
                    <WideButton asChild variant="black">
                        <Link href="/authenticate/verify?purpose=password_reset">Continue</Link>
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default ForgotPasswordPage
