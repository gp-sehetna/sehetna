import { cn } from "@/lib/utils"
import DividerDecoration from "./DividerDecoration"

type DividerProps = {
    vertical?: boolean
    children?: React.ReactNode
    className?: string
}

const Divider = ({ vertical = false, children, className = "" }: DividerProps) => {
    if (!children) {
        if (!vertical) {
            return (
                <div
                    data-component="divider"
                    className={cn("shrink-0 bg-neutral-200", "h-px w-full", className)}
                />
            )
        }
        return (
            <div
                data-component="divider"
                className={cn("shrink-0 bg-neutral-200", "h-1/2 w-px", className)}
            />
        )
    }
    if (!vertical) {
        return (
            <div
                data-component="divider"
                className={cn(
                    "relative flex items-center gap-4 text-sm text-neutral-500",
                    "w-full",
                    className
                )}
            >
                <DividerDecoration side="left" />

                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-sm whitespace-nowrap">{children}</span>
                <span className="h-px flex-1 bg-neutral-200" />

                <DividerDecoration side="right" />
            </div>
        )
    }
    return (
        <div
            data-component="divider"
            className={cn(
                "flex items-center gap-4 text-sm text-neutral-500",
                "h-full flex-col",
                className
            )}
        >
            <span className="h-full w-px bg-neutral-200" />
            <span className="text-xs font-bold whitespace-nowrap">{children}</span>
            <span className="h-full w-px bg-neutral-200" />
        </div>
    )
}

export default Divider
