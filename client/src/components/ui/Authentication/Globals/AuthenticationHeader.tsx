"use client"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import Flex from "../../Flex"
import Logo from "../../GlobalControls/Logo"

type AuthenticationHeaderProps = {
    title: ReactNode
    subtitle: ReactNode
    className?: string
}

export default function AuthenticationHeader({
    title,
    subtitle,
    className,
}: AuthenticationHeaderProps) {
    return (
        <Flex direction="col" gap={4} className={cn("items-center md:items-start", className)}>
            <Logo />
            <Flex direction="col" gap={1} className={cn("items-center md:items-start", className)}>
                {title}
                {subtitle}
            </Flex>
        </Flex>
    )
}
