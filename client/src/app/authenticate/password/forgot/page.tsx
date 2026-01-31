import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { Mail } from "lucide-react"
import Link from "next/link"

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
                        label="Email Address"
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
