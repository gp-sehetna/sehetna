"use client"

import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import BaseAuthentication from "@/components/ui/Authentication/BaseAuthentication"
import Flex from "@/components/ui/Flex"
import ShowHidePasswordButton from "@/components/ui/GlobalControls/ShowHidePasswordButton"
import WideButton from "@/components/ui/WideButton"
import { Mail, LogIn, KeyRound } from "lucide-react"
import { useState } from "react"

const LoginRawPage = () => {
    const title = <h3>Log In with your email</h3>
    const subtitle = <p className="text-md text-neutral-600">Enter your credentials</p>

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
                        name="Email Address"
                        htmlFor="email"
                        id="email"
                        type="email"
                        placeholder="abc@example.com"
                        required
                        prependInnerIcon={<Mail />}
                    />
                    <AuthenticationField
                        name="Password"
                        htmlFor="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        prependInnerIcon={<KeyRound />}
                        appendInnerIcon={ShowHideIcon}
                        inlineOptions={forgotPasswordButton}
                    />
                </Flex>
                <WideButton variant="black">Log In</WideButton>
                <Flex direction="col" gap={4}>
                    <p className="text-xs">Don&apos;t have an account?</p>
                    <WideButton size="lg" variant="outline">
                        <LogIn />
                        Sign Up
                    </WideButton>
                </Flex>
            </BaseAuthentication>
        </>
    )
}

export default LoginRawPage
