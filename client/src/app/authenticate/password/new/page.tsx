import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import WideButton from "@/components/ui/WideButton"
import { LockIcon } from "lucide-react"

const NewPasswordPage = () => {
    const title = <h3>Reset password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">Kindly set your new password and confirm it</p>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationPasswordInput id="new-password" name="New Password" />
                    <AuthenticationPasswordInput id="confirm-password" name="Confirm Password" />
                </Flex>
                <WideButton variant="black">
                    <LockIcon /> Set New Password
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default NewPasswordPage
