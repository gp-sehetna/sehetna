import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import WideButton from "@/components/ui/WideButton"
import { LogIn } from "lucide-react"

const SignUpRawPage = () => {
    const title = <h3>Create your account</h3>
    const subtitle = <p className="text-neutral-600 text-md">Enter your email address to continue</p>
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <AuthenticationField />
                <WideButton variant="black">Continue</WideButton>

                <Flex direction="col" gap={4}>
                    <p className="text-xs">
                        Aleady have an account?
                    </p>
                    <WideButton size="lg" variant="outline">
                        <LogIn />
                        Log In
                    </WideButton>
                </Flex>

            </BaseAuthentication>
        </>
    )
}

export default SignUpRawPage