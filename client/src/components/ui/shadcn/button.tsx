import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
    "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary-500 active:bg-primary-600",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary-400 active:bg-secondary-300",
                glassy: "glassy base-transition hover:text-neutral-1000 text-neutral-800 hover:bg-neutral-400/20 active:bg-neutral-300/40",
                outline:
                    "border-primary text-primary bg-background border-primary hover:bg-accent hover:text-accent-foreground border",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",

                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary-foregroud underline-offset-2 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 [&_svg]:size-4",
                sm: "h-8 rounded-md px-3 text-xs [&_svg]:size-4",
                lg: "h-10 rounded-md px-8 [&_svg]:size-4",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
