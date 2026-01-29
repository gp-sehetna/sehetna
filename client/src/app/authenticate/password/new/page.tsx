import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { LockIcon } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Set a new password for your Sehetna account.",
}

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
