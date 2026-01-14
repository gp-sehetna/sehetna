"use client"

import { Button } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils"
import { ButtonSize } from "@/types/ui/Global"

type WideButtonProps = {
    variant: "outline" | "gradient" | "black"
    size?: ButtonSize
    children?: React.ReactNode
    onClick?: () => void
}

const baseStyles =
    "w-[396px] sm:w-[488px] py-2 sm:py-3 flex items-center justify-center font-light rounded-full base-transition cursor-pointer"

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

export default function WideButton({ variant, size, onClick, children }: WideButtonProps) {
    return (
        <Button size={size} onClick={onClick} className={cn(baseStyles, variants[variant])}>
            {children}
        </Button>
    )
}
