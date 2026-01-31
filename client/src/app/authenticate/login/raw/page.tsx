import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { ILoginInputsDTO } from "@/features/auth/auth.dto"
import { LoginSchema } from "@/features/auth/auth.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

const LoginRawPage = () => {
    const router = useRouter()
    const { register, handleSubmit, formState } = useForm<ILoginInputsDTO>({
        resolver: zodResolver(LoginSchema),
        mode: "onSubmit",
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onSubmit({ email, password }: ILoginInputsDTO) {
        // TODO: Call endpoint to login user
        // TODO: Navigate to the last recent path user was in.
        router.push("/")
    }

    return (
        <>
            <BaseAuthentication
                title={<h3>Log In with your email</h3>}
                subtitle={<p className="text-md text-neutral-600">Enter your credentials</p>}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Flex direction="col" gap={4}>
                    <AuthenticationField
                        {...register("email")}
                        errors={[formState.errors.email]}
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        prependInnerIcon={<Mail />}
                    />
                    <AuthenticationPasswordInput
                        {...register("password")}
                        errors={[formState.errors.password]}
                        id="login-password"
                        label="Password"
                        inlineOptions={
                            <Link href="/authenticate/password/forgot">
                                <p className="cursor-pointer text-xs">Forgot password?</p>
                            </Link>
                        }
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
