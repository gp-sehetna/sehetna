import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import WideButton from "@/components/ui/WideButton"

const OldPasswordPage = () => {
    const title = <h3>Enter your old password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">
            Please enter your old password to verify eligibility
        </p>
    )

    const forgotPasswordButton = <p className="cursor-pointer text-xs">Forgot password?</p>
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationPasswordInput
                        id="old-password"
                        name="Old Password"
                        inlineOptions={forgotPasswordButton}
                    />
                    <WideButton variant="black">Continue</WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default OldPasswordPage
