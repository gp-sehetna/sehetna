import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { LogIn, Mail } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new account on Sehetna to access healthcare insights and data.",
}

const SignUpRawPage = () => {
    const title = <h3>Create your account</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">Enter your email address to continue</p>
    )
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationField
                        name="Email Address"
                        id="email"
                        type="email"
                        placeholder="abc@example.com"
                        required
                        prependInnerIcon={<Mail />}
                    />
                </Flex>
                <WideButton asChild variant="black">
                    <Link href="/authenticate/verify?purpose=password_reset">Continue</Link>
                </WideButton>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Aleady have an account?</p>
                    <WideButton asChild size="lg" variant="outline">
                        <Link href="/authenticate/login">
                            <LogIn />
                            Log In
                        </Link>
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default SignUpRawPage
