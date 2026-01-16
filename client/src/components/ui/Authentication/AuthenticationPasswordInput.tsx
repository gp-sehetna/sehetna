"use client"

import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import ShowHidePasswordButton from "@/components/ui/GlobalControls/ShowHidePasswordButton"
import { KeyRound } from "lucide-react"
import { useState } from "react"

type AuthenticationPasswordInputProps = {
    id: string
    name: string
    inlineOptions?: React.ReactNode
}

const AuthenticationPasswordInput = ({
    id,
    name,
    inlineOptions,
}: AuthenticationPasswordInputProps) => {
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
            <AuthenticationField
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                placeholder={`Enter your ${name.toLowerCase()}`}
                required
                prependInnerIcon={<KeyRound />}
                appendInnerIcon={ShowHideIcon}
                inlineOptions={inlineOptions}
            />
        </>
    )
}

export default AuthenticationPasswordInput
