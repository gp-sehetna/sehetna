"use client"
import AuthenticationPasswordInput from "@/components/ui/Authentication/AuthenticationPasswordInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { ConfirmPasswordInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { ConfirmPasswordSchema } from "@/features/auth/auth.validation"
import { navigateToLastRoute } from "@/lib/auth/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"

const NewPasswordPage = () => {
    const router = useRouter()
    const params = useSearchParams()

    const authService = useMemo(() => new AuthClientService(), [])
    const { register, handleSubmit, formState } = useForm<ConfirmPasswordInputsDTO>({
        resolver: zodResolver(ConfirmPasswordSchema),
        mode: "onSubmit",
    })

    const onSubmit = async ({ password }: ConfirmPasswordInputsDTO) => {
        await authService.updatePassword({ password })
        navigateToLastRoute(router, params)
    }

    return (
        <>
            <BaseAuthentication
                title={<h3>Reset password</h3>}
                subtitle={
                    <p className="text-md text-neutral-600">
                        Kindly set your new password and confirm it
                    </p>
                }
                onSubmit={handleSubmit(onSubmit)}
            >
                <Flex direction="col" gap={4}>
                    <AuthenticationPasswordInput
                        {...register("password")}
                        errors={[formState.errors.password]}
                        id="new-password"
                        label="New Password"
                    />
                    <AuthenticationPasswordInput
                        {...register("confirmPassword")}
                        errors={[formState.errors.confirmPassword]}
                        id="confirm-password"
                        label="Confirm Password"
                    />
                </Flex>
                <WideButton type="submit" variant="black">
                    <LockIcon /> Set New Password
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default NewPasswordPage
