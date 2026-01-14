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
                    className={cn("bg-neutral-200 shrink-0", "h-px w-full", className)}
                />
            )
        }
        return (
            <div
                data-component="divider"
                className={cn("bg-neutral-200 shrink-0", "w-px h-1/2", className)}
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

                <span className="bg-neutral-200 h-px flex-1" />
                <span className="text-sm whitespace-nowrap">{children}</span>
                <span className="bg-neutral-200 h-px flex-1" />

                <DividerDecoration side="right" />
            </div>
        )
    }
    return (
        <div
            data-component="divider"
            className={cn(
                "flex items-center gap-4 text-sm text-neutral-500",
                "flex-col h-full",
                className
            )}
        >
            <span className="bg-neutral-200 h-full w-px" />
            <span className="font-bold text-xs whitespace-nowrap">{children}</span>
            <span className="bg-neutral-200 h-full w-px" />
        </div>
    )
}

export default Divider
