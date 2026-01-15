import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import WideButton from "@/components/ui/WideButton"
import { Mail } from "lucide-react"

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
                        htmlFor="email"
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        prependInnerIcon={<Mail />}
                    />
                    <WideButton variant="black">Continue</WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default ForgotPasswordPage
