import { ReactNode } from "react"

type FlexProps = {
    children: ReactNode
    direction?: "row" | "col"
    gap?: number
    className?: string
}

const Flex = ({ direction = "row", children, gap = 0, className }: FlexProps) => {
    return <div className={`flex flex-${direction} ${className} gap-${gap}`}>{children}</div>
}

export default Flex
