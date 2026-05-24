import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import SignInWithGoogle from "@/components/ui/Authentication/SignInWithGoogle"
import Flex from "@/components/ui/Flex"
import Divider from "@/components/ui/GlobalControls/Divider"
import { AlertCircle, LogIn } from "lucide-react"
import Link from "next/link"

type LogInPageProps = {
    searchParams?: Promise<{
        error?: string
    }>
}

const LogInPage = async ({ searchParams }: LogInPageProps) => {
    const errorMessage = (await searchParams)?.error

    return (
        <>
            <BaseAuthentication
                title={<h4>Hello again!</h4>}
                subtitle={<h2 className="text-primary">Log in to Sehetna</h2>}
            >
                <Flex direction="col" gap={4}>
                    {errorMessage && (
                        <div className="border-destructive/15 bg-destructive/3 text-destructive flex w-full items-start gap-2 rounded-2xl border px-4 py-3 text-sm">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p className="text-sm">{errorMessage}</p>
                        </div>
                    )}
                    <SignInWithGoogle />
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
