"use client"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/shadcn/input-otp"

import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import WideButton from "@/components/ui/WideButton"
import { Button } from "@/components/ui/shadcn/button"

const purposes = new Set(["email_verification", "password_reset"])

const VerifyPage = () => {
    //* Should be in the middleware
    const searchParams = useSearchParams()
    const requiredParam = searchParams.get("purpose")
    const router = useRouter()
    if (!requiredParam || !purposes.has(requiredParam)) router.push("/authenticate/login")
    //* ------------------------------

    const title = <h3>Check your inbox</h3>
    const subtitle = <p className="text-md text-neutral-600">Mail could be flagged as spam</p>
    return (
        <>
            <BaseAuthentication className="md:items-center" title={title} subtitle={subtitle}>
                <p className="text-center text-sm">
                    We&apos;ve sent you a passcode.
                    <br /> Please check your inbox at a******************@g****.com.
                </p>
                <InputOTP className="flex justify-center" maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <WideButton variant="black">Continue</WideButton>
                <Button variant="ghost">Resend Code</Button>
            </BaseAuthentication>
        </>
    )
}

export default VerifyPage
