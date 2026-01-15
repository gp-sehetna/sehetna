"use client"

import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import ShowHidePasswordButton from "@/components/ui/GlobalControls/ShowHidePasswordButton"
import WideButton from "@/components/ui/WideButton"
import { KeyRound } from "lucide-react"
import { useState } from "react"

const OldPasswordPage = () => {
    const title = <h3>Enter your old password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">
            Please enter your old password to verify eligibility
        </p>
    )

    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const ShowHideIcon = (
        <ShowHidePasswordButton
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
        />
    )
    const forgotPasswordButton = <p className="cursor-pointer text-xs">Forgot password?</p>
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationField
                        name="Old Password"
                        htmlFor="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        prependInnerIcon={<KeyRound />}
                        appendInnerIcon={ShowHideIcon}
                        inlineOptions={forgotPasswordButton}
                    />
                    <WideButton variant="black">Continue</WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default OldPasswordPage
