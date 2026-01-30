import * as React from "react"

import { cn } from "@/lib/utils/cn"
import { cva, VariantProps } from "class-variance-authority"

export const inputVariants = cva(
    "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-secondary/15 focus-visible:border-secondary flex h-9 w-full min-w-50 border bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "",
            },
            size: {
                default: "px-4 py-5 text-base",
                sm: "px-3 py-1 text-sm",
                lg: "px-6 py-7 text-lg",
            },
            rounded: {
                default: "rounded-md",
                sm: "rounded-sm",
                lg: "rounded-lg",
                xl: "rounded-xl",
                xxl: "rounded-2xl",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
    VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ size, rounded, className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ rounded, size }), className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
