import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import GoogleIcon from "@/components/ui/Authentication/Globals/GoogleIcon"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import Divider from "@/components/ui/GlobalControls/Divider"
import { LogIn } from "lucide-react"
import Link from "next/link"

const LogInPage = () => {
    return (
        <>
            <BaseAuthentication
                title={<h4>Hello again!</h4>}
                subtitle={<h2 className="text-primary">Log in to Sehetna</h2>}
            >
                <Flex direction="col" gap={4}>
                    <WideButton size="lg" variant="outline">
                        <GoogleIcon />
                        Sign in with Google
                    </WideButton>
                    <Divider>OR</Divider>
                    <WideButton asChild size="lg" variant="gradient">
                        <Link href="/authenticate/login/raw">Sign in with email address</Link>
                    </WideButton>
                </Flex>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Don&apos;t have an account?</p>
                    <WideButton asChild size="lg" variant="outline">
                        <Link href="signup">
                            <LogIn />
                            Sign Up
                        </Link>
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default LogInPage
