"use client"
import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { FormInputField } from "@/components/ui/forms/inputs/FormInputField"

import { PasswordAndNameInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { PasswordAndNameSchema } from "@/features/auth/auth.validation"
import { zodResolver } from "@hookform/resolvers/zod"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"

const SignupCredentialsPage = () => {
    const router = useRouter()

    const authService = useMemo(() => new AuthClientService(), [])
    const { register, handleSubmit, formState } = useForm<PasswordAndNameInputsDTO>({
        resolver: zodResolver(PasswordAndNameSchema),
        mode: "onSubmit",
    })

    const onSubmit = async (fields: PasswordAndNameInputsDTO) => {
        await authService.signup(fields)
        router.push("/authenticate/login/raw")
    }

    return (
        <>
            <BaseAuthentication
                title={<h3>Continue your credentials</h3>}
                subtitle={
                    <p className="text-md text-neutral-600">
                        Almost there, let’s finish setting up your account
                    </p>
                }
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
                    <FormInputField
                        {...register("firstName")}
                        errors={[formState.errors.firstName]}
                        label="First Name"
                        type="text"
                        placeholder="Enter your first name"
                    />
                    <FormInputField
                        {...register("lastName")}
                        errors={[formState.errors.lastName]}
                        label="Last Name"
                        type="text"
                        placeholder="Enter your last name"
                    />
                </div>
                <Flex direction="col" gap={2} className="md:w-full">
                    <AuthenticationPasswordInput
                        {...register("password")}
                        errors={[formState.errors.password]}
                        id="login-password"
                        label="Password"
                    />
                    <p className="text-xs text-neutral-600">
                        Use 8 or more characters with a mix of letters, numbers & symbols
                    </p>
                </Flex>
                <WideButton size="lg" variant="gradient">
                    Create an account
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default SignupCredentialsPage
