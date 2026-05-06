"use client"

import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import Flex from "@/components/ui/Flex"
import { Button } from "@/components/ui/shadcn/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/shadcn/input-otp"
import { OTPInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { OtpSchema } from "@/features/auth/auth.validation"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { useUserStore } from "@/stores/user/use-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const authService = useMemo(() => new AuthClientService(), [])
    const setUser = useUserStore((s) => s.setUser)
    const { control, handleSubmit, formState } = useForm<OTPInputsDTO>({
        resolver: zodResolver(OtpSchema),
    })

    const email = searchParams.get("mail") as string

    const onSubmit = async ({ otp }: OTPInputsDTO) => {
        const { destination, user } = await authService.verifyOtp(otp, searchParams.get("purpose"))

        // TODO: user is not set instantly after email change, maybe we should fetch user data again in the settings page instead of relying on this response
        if (searchParams.get("purpose") == PurposeEnum.emailChange && user) setUser(user)

        router.replace(destination)
    }

    return (
        <BaseAuthentication
            onSubmit={handleSubmit(onSubmit)}
            className="md:items-center"
            title={<h3>Check your inbox</h3>}
            subtitle={<p className="text-md text-neutral-600">Mail could be flagged as spam</p>}
        >
            <p className="text-center text-sm">
                We&apos;ve sent you a passcode.
                <br /> Please check your inbox at {decodeURIComponent(email)}.
            </p>
            <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                    <Flex className="items-center" gap={2} direction="col">
                        <InputOTP
                            {...field}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                        >
                            {[0, 1, 2].map((i) => (
                                <InputOTPGroup key={i}>
                                    <InputOTPSlot index={i} />
                                </InputOTPGroup>
                            ))}

                            <InputOTPSeparator />

                            {[3, 4, 5].map((i) => (
                                <InputOTPGroup key={i}>
                                    <InputOTPSlot index={i} />
                                </InputOTPGroup>
                            ))}
                        </InputOTP>
                        {formState.errors.otp && (
                            <p className="text-sm text-red-500">{formState.errors.otp.message}</p>
                        )}
                    </Flex>
                )}
            />

            <WideButton type="submit" variant="black">
                Continue
            </WideButton>
            <Button variant="ghost">Resend Code</Button>
        </BaseAuthentication>
    )
}
