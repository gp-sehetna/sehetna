import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import SignInWithGoogle from "@/components/ui/Authentication/SignInWithGoogle"
import Flex from "@/components/ui/Flex"
import { policiesItems } from "@/components/ui/GlobalComponents/nav/navigation-items"
import AppLink from "@/components/ui/GlobalControls/AppLink"
import Divider from "@/components/ui/GlobalControls/Divider"
import { LogIn } from "lucide-react"
import Link from "next/link"

const SignUpPage = () => {
    const btnSize = "lg"
    return (
        <>
            <BaseAuthentication
                title={<p>Start your journey</p>}
                subtitle={<h2 className="text-primary">Sign Up to Sehetna</h2>}
            >
                <Flex direction="col" gap={4}>
                    <SignInWithGoogle />
                    <Divider>OR</Divider>
                    <Flex direction="col" gap={2}>
                        <WideButton asChild size={btnSize} variant="gradient">
                            <Link href="/authenticate/signup/raw">Sign up with email address</Link>
                        </WideButton>
                        <p className="w-75 text-xs font-extralight">
                            By signing up, you agree to the&thinsp;
                            <AppLink href={policiesItems[1].href}>{policiesItems[1].title}</AppLink>
                            &thinsp; and&thinsp;
                            <AppLink href={policiesItems[0].href}>{policiesItems[0].title}</AppLink>
                            , including&thinsp;
                            <AppLink href={policiesItems[2].href}>{policiesItems[2].title}</AppLink>
                            .
                        </p>
                    </Flex>
                </Flex>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Aleady have an account?</p>
                    <WideButton asChild size={btnSize} variant="black-outline">
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

export default SignUpPage
