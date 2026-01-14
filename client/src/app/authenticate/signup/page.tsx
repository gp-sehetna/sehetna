import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import AppLink from "@/components/ui/GlobalControls/AppLink"
import Divider from "@/components/ui/GlobalControls/Divider"
import WideButton from "@/components/ui/WideButton"
import { LogIn } from "lucide-react"
import Image from "next/image"

type GoogleIconProps = {
    size?: number
}
const GoogleIcon = ({ size = 16 }: GoogleIconProps) => {
    return <Image width={size} height={size} alt="Google logo" src="/Google.svg" />
}

const SignUpPage = () => {
    const title = <p>Start your journey</p>
    const subtitle = <h2 className="text-primary">Sign Up to Sehetna</h2>

    const btnSize = "lg"
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <WideButton size={btnSize} variant="outline">
                        <GoogleIcon />
                        Sign up with Google
                    </WideButton>
                    <Divider>OR</Divider>
                    <Flex direction="col" gap={2}>
                        <WideButton size={btnSize} variant="gradient">
                            Sign up with email address
                        </WideButton>
                        <p className="text-xs font-extralight w-75">
                            By signing up, you agree to the&thinsp;
                            <AppLink href="#Terms">Terms of Service</AppLink>&thinsp; and&thinsp;
                            <AppLink href="#PrivacyPolicy">Privacy Policy</AppLink>,
                            including&thinsp;
                            <AppLink href="#CookieUse">Cookie Use</AppLink>.
                        </p>
                    </Flex>
                </Flex>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Aleady have an account?</p>
                    <WideButton size={btnSize} variant="outline">
                        <LogIn />
                        Log In
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default SignUpPage
