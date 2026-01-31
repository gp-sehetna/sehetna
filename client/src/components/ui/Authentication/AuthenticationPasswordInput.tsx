"use client"

import { AuthenticationField } from "@/components/ui/Authentication/AuthenticationInput"
import ShowHidePasswordButton from "@/components/ui/GlobalControls/ShowHidePasswordButton"
import { KeyRound } from "lucide-react"
import { useState } from "react"
import { InputProps } from "@/components/ui/shadcn/input"
import RHF from "react-hook-form"

type AuthenticationPasswordInputProps = {
    id: string
    label: string
    inlineOptions?: React.ReactNode
    errors?: Array<RHF.FieldError | undefined>
} & InputProps

const AuthenticationPasswordInput = ({
    id,
    label,
    inlineOptions,
    ...props
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
                {...props}
                id={id}
                label={label}
                type={showPassword ? "text" : "password"}
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
                prependInnerIcon={<KeyRound />}
                appendInnerIcon={ShowHideIcon}
                inlineOptions={inlineOptions}
            />
        </>
    )
}

export default AuthenticationPasswordInput
