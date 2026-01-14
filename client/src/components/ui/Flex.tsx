import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type FlexProps = {
    children: ReactNode
    direction?: "row" | "col"
    gap?: number
    className?: string
}

const Flex = ({ direction = "row", children, gap = 0, className }: FlexProps) => {
    const flexAndGap = `flex flex-${direction} gap-${gap}`
    return <div className={cn(flexAndGap, `w-full sm:w-auto`, className)}>{children}</div>
}

export default Flex
