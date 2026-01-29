"use client"

import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/Authentication/Globals/WideButton"
import { Button } from "@/components/ui/shadcn/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/shadcn/input-otp"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const purposes = new Set(["email_verification", "password_reset"])

export default function VerifyClient() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const requiredParam = searchParams.get("purpose")

    useEffect(() => {
        if (!requiredParam || !purposes.has(requiredParam)) router.replace("/authenticate/login")
    }, [requiredParam, router])

    const title = <h3>Check your inbox</h3>
    const subtitle = <p className="text-md text-neutral-600">Mail could be flagged as spam</p>

    return (
        <BaseAuthentication className="md:items-center" title={title} subtitle={subtitle}>
            <p className="text-center text-sm">
                We&apos;ve sent you a passcode.
                <br /> Please check your inbox at a******************@g****.com.
            </p>

            <InputOTP className="flex justify-center" maxLength={6}>
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

            <WideButton variant="black">Continue</WideButton>
            <Button variant="ghost">Resend Code</Button>
        </BaseAuthentication>
    )
}
