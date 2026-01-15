"use client"

import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import ShowHidePasswordButton from "@/components/ui/GlobalControls/ShowHidePasswordButton"
import WideButton from "@/components/ui/WideButton"
import { KeyRound, LockIcon } from "lucide-react"
import { useState } from "react"

const NewPasswordPage = () => {
    const title = <h3>Reset password</h3>
    const subtitle = (
        <p className="text-md text-neutral-600">Kindly set your new password and confirm it</p>
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
    return (
        <>
            <BaseAuthentication title={title} subtitle={subtitle}>
                <Flex direction="col" gap={4}>
                    <AuthenticationField
                        name="New Password"
                        htmlFor="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        prependInnerIcon={<KeyRound />}
                        appendInnerIcon={ShowHideIcon}
                    />
                    <AuthenticationField
                        name="Confirm Password"
                        htmlFor="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        prependInnerIcon={<KeyRound />}
                        appendInnerIcon={ShowHideIcon}
                    />
                </Flex>
                <WideButton variant="black">
                    <LockIcon /> Set New Password
                </WideButton>
            </BaseAuthentication>
        </>
    )
}

export default NewPasswordPage
