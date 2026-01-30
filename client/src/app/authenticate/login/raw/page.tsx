import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { LogIn, Mail } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Log In",
    description: "Access your Sehetna account to explore healthcare insights and data.",
}

const LoginRawPage = () => {
    const title = <h3>Log In with your email</h3>
    const subtitle = <p className="text-md text-neutral-600">Enter your credentials</p>
    const forgotPasswordButton = (
        <Link href="/authenticate/password/forgot">
            <p className="cursor-pointer text-xs">Forgot password?</p>
        </Link>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationField
                        name="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        prependInnerIcon={<Mail />}
                    />
                    <AuthenticationPasswordInput
                        id="login-password"
                        name="Password"
                        inlineOptions={forgotPasswordButton}
                    />
                </Flex>
                <WideButton variant="black">Log In With Credentials</WideButton>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Don&apos;t have an account?</p>
                    <WideButton asChild size="lg" variant="outline">
                        <Link href="/authenticate/signup">
                            <LogIn />
                            Sign Up
                        </Link>
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default LoginRawPage
