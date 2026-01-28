"use client"

import { Button } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils/cn"

type ButtonSize = "default" | "sm" | "lg" | "icon"
type WideButtonProps = {
    variant: any
    size?: ButtonSize
    children?: React.ReactNode
    // onClick?: () => void
}

export default function WideButton({ variant, size, children }: WideButtonProps) {
    return (
        <Button
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
