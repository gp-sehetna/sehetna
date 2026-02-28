import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("bg-foreground/4 animate-pulse rounded-md", className)} {...props} />
}

export { Skeleton }
