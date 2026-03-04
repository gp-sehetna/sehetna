"use client"

import { Button, ButtonProps } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils"

type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon"
type WideButtonProps = {
    variant?: any
    size?: ButtonSize
    children?: React.ReactNode
    asChild?: boolean
} & ButtonProps

export default function WideButton({
    variant = "default",
    size,
    asChild,
    children,
}: WideButtonProps) {
    return (
        <Button
            asChild={asChild}
            size={size}
            variant={variant}
            className={cn(
                "base-transition box-border flex w-full cursor-pointer items-center justify-center rounded-full py-3 font-light"
            )}
        >
            {children}
        </Button>
    )
}
