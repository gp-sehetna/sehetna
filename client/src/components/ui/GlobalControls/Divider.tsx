import { cn } from "@/lib/utils"
import DividerDecoration from "./DividerDecoration"

type DividerProps = {
    vertical?: boolean
    children?: React.ReactNode
    className?: string
    stripsClassName?: string
    hideDecorations?: boolean // New Prop
}

const Divider = ({
    vertical = false,
    children,
    className,
    stripsClassName,
    hideDecorations = false, // Default to showing them
}: DividerProps) => {
    // 1. Simple Divider (No text/children)
    if (!children) {
        return (
            <div
                data-component="divider"
                className={cn(
                    "bg-border shrink-0",
                    // Changed w-fit to w-full for horizontal
                    vertical ? "h-1/2 w-px" : "h-[0.5px] w-full",
                    className
                )}
            />
        )
    }

    // 2. Horizontal Divider with Text
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
                {!hideDecorations && <DividerDecoration side="left" />}

                <span className={cn("bg-border h-px flex-1", stripsClassName)} />
                <span className="text-sm whitespace-nowrap">{children}</span>
                <span className={cn("bg-border h-px flex-1", stripsClassName)} />

                {!hideDecorations && <DividerDecoration side="right" />}
            </div>
        )
    }

    // 3. Vertical Divider with Text
    return (
        <div
            data-component="divider"
            className={cn(
                "flex items-center gap-4 text-sm text-neutral-500",
                "h-full flex-col",
                className
            )}
        >
            <span className={cn("bg-border h-full w-px", stripsClassName)} />
            <span className="text-xs font-bold whitespace-nowrap">{children}</span>
            <span className={cn("bg-border h-full w-px", stripsClassName)} />
        </div>
    )
}

export default Divider
