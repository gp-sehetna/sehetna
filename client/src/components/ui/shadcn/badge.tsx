import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const badgeVariants = cva(
    "focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
    {
        variants: {
            variant: {
                default:
                    "bg-primary/80 text-primary-foreground hover:bg-primary/60 border-transparent",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
                glassy: "glassy base-transition hover:text-neutral-1000 text-neutral-800 hover:bg-neutral-100/60 active:bg-neutral-100/40",
                destructive:
                    "bg-destructive/90 text-background hover:bg-destructive/80 border-transparent shadow",
                outline: "text-foreground",
                "primary-tonal":
                    "border-primary/10 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/25",
                muted: "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
