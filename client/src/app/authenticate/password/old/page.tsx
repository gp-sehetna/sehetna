import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import Link from "next/link"

const OldPasswordPage = () => {
    const title = <h3>Enter your old password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">
            Please enter your old password to verify eligibility
        </p>
    )

    const forgotPasswordButton = (
        <Link href="/authenticate/password/forgot">
            <p className="cursor-pointer text-xs">Forgot password?</p>
        </Link>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationPasswordInput
                        id="old-password"
                        label="Old Password"
                        inlineOptions={forgotPasswordButton}
                    />
                    <WideButton variant="black">Continue</WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default OldPasswordPage
