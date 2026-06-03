import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const buttonVariants = cva(
    "focus-visible:ring-ring base-transition focus:ring-accent inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary-500 active:bg-primary-600",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary-400 active:bg-secondary-300",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",

                outline: cn(
                    "disabled:text-muted-foreground/50 border border-neutral-200 bg-neutral-100 disabled:border-neutral-200/20",
                    "hover:bg-neutral-200",
                    "active:bg-neutral-300"
                ),
                bright: cn(
                    "hover:border-primary-500/30 bg-background/80 border border-neutral-200 text-neutral-900 shadow-sm backdrop-blur-xl"
                ),
                "bright-primary":
                    "text-background from-primary-300 to-primary-500 hover:shadow-primary/70 shadow-primary-600/20 bg-linear-150 shadow-2xl transition-shadow duration-500",
                white: cn(
                    "text-neutral-1000 border border-neutral-200 bg-white",
                    "hover:bg-neutral-100",
                    "active:bg-neutral-200"
                ),
                black: cn(
                    "border-neutral-1000 border bg-black text-neutral-100",
                    "hover:bg-neutral-1000/90 shadow-md",
                    "active:bg-neutral-1000/80"
                ),
                gradient: "special-gradient border-none text-neutral-100",
                glassy: "glassy hover:bg-neutral-100/60 hover:text-neutral-800 active:bg-neutral-100/40",

                tonal: "bg-accent/50 hover:bg-accent/80 text-neutral-900",
                ghost: "hover:text-neutral-1000 text-neutral-600",
                text: "text-neutral-1000",
                link: "text-primary-foregroud underline-offset-2 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 [&_svg]:size-4",
                xs: "h-6 rounded-md px-2 text-xs [&_svg]:size-2",
                sm: "h-8 rounded-md px-3 text-xs [&_svg]:size-4",
                lg: "h-10 rounded-xl px-8 [&_svg]:size-4",
                xl: "h-12 rounded-2xl px-6 text-sm font-semibold md:h-14 md:px-10",
                icon: "h-9 w-9",
                "icon-xl": "h-9 w-9 md:h-16 md:w-16",
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
