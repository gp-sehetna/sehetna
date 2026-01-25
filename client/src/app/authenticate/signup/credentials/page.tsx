import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import { KeyRound } from "lucide-react"

const CredentialsPage = () => {
    const title = <h3>Continue your credentials</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">
            Almost there, let’s finish setting up your account
        </p>
    )

    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
                    <AuthenticationField
                        name="First name"
                        type="text"
                        placeholder="Enter your first name"
                    />
                    <AuthenticationField
                        name="Last name"
                        type="text"
                        placeholder="Enter your last name"
                    />
                </div>
                <Flex direction="col" gap={2} className="md:w-full">
                    <AuthenticationField
                        name="Password"
                        type="password"
                        placeholder="Enter your password"
                        prependInnerIcon={<KeyRound />}
                    />
                    <p className="text-xs text-neutral-600">
                        Use 8 or more characters with a mix of letters, numbers & symbols
                    </p>
                </Flex>
                <WideButton size="lg" variant="gradient">
                    Create an account
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default CredentialsPage
