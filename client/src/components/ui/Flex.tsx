import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type FlexProps = {
    children: ReactNode
    direction?: "row" | "col" | "wrap"
    gap?: number
    className?: string
}

const gaps = [
    "gap-0",
    "gap-1",
    "gap-2",
    "gap-3",
    "gap-4",
    "gap-5",
    "gap-6",
    "gap-7",
    "gap-8",
    "gap-9",
    "gap-10",
]

const Flex = ({ direction = "row", gap = 0, children, className }: FlexProps) => {
    return (
        <div
            className={cn(
                "flex w-full",
                direction === "row" ? "flex-row" : direction === "col" ? "flex-col" : "flex-wrap",
                gaps[gap],
                className
            )}
        >
            {children}
        </div>
    )
}
export default Flex
