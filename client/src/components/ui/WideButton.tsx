"use client"

import { Button } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils"
import { ButtonSize } from "@/types/ui/Global"

type WideButtonProps = {
    variant: "outline" | "gradient" | "black"
    size?: ButtonSize
    children?: React.ReactNode
    // onClick?: () => void
}

const baseStyles = cn(
    "base-transition box-border flex w-full cursor-pointer items-center justify-center rounded-full py-3 font-light"
)

const variants = {
    outline: cn(
        "border-neutral-1000 border bg-neutral-100",
        "hover:bg-neutral-200",
        "active:bg-neutral-300"
    ),
    black: cn(
        "border-neutral-1000 border bg-black text-neutral-100",
        "hover:bg-neutral-1000/90 shadow-md",
        "active:bg-neutral-1000/80"
    ),

    gradient: cn("special-gradient base-transition border-none text-neutral-100"),
}

export default function WideButton({ variant, size, children }: WideButtonProps) {
    return (
        <Button size={size} className={cn(baseStyles, variants[variant])}>
            {children}
        </Button>
    )
}
