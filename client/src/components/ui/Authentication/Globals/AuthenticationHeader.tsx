"use client"
import { cn } from "@/lib/utils/cn"
import Flex from "../../Flex"
import Logo from "../../GlobalControls/Logo"
import { ReactNode } from "react"

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
