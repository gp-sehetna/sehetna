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
        <Flex direction="col" gap={4}>
            <Logo />
            <Flex direction="col" gap={1}>
                {title}
                {subtitle}
            </Flex>
        </Flex>
    )
}
