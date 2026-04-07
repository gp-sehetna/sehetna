import { cn } from "@/lib/utils"
import React from "react"

type GradientWhere = "top" | "bottom" | "left" | "right" | "horizontal" | "vertical"

type GradientProps = {
    children?: React.ReactNode
    className?: string
    tint?: string
    where?: GradientWhere
}

const gradientVariants: Record<GradientWhere, string> = {
    top: "bg-linear-to-b from-black/80 to-transparent",
    bottom: "bg-linear-to-t from-black/80 to-transparent",
    left: "bg-linear-to-r from-black/80 to-transparent",
    right: "bg-linear-to-l from-black/80 to-transparent",
    vertical: "bg-linear-to-b from-black/60 via-transparent to-black/80",
    horizontal: "bg-linear-to-r from-black/80 via-transparent to-black/80",
}

function Gradient({ children, className, tint, where = "vertical" }: GradientProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0",
                gradientVariants[where],
                className,
                tint
            )}
        >
            {children}
        </div>
    )
}

export default Gradient
