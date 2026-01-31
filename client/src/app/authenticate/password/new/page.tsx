import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { LockIcon } from "lucide-react"
import Link from "next/link"

const NewPasswordPage = () => {
    const title = <h3>Reset password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">Kindly set your new password and confirm it</p>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationPasswordInput id="new-password" label="New Password" />
                    <AuthenticationPasswordInput id="confirm-password" label="Confirm Password" />
                </Flex>
                <WideButton asChild variant="black">
                    <Link href="/authenticate/login/raw">
                        <LockIcon /> Set New Password
                    </Link>
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default NewPasswordPage
