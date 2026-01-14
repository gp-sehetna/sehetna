"use client"
import Flex from "../../Flex"
import Logo from "../../GlobalControls/Logo"
import { ReactNode } from "react"

type AuthenticationHeaderProps = {
    title: ReactNode
    subtitle: ReactNode
}

export default function AuthenticationHeader({ title, subtitle }: AuthenticationHeaderProps) {
    return (
        <Flex direction="col" gap={4} className="items-center sm:items-start">
            <Logo />
            <Flex direction="col" gap={1} className="items-center sm:items-start">
                {title}
                {subtitle}
            </Flex>
        </Flex>
    )
}
