import { cn } from "@/lib/utils"

type DividerDecorationProps = {
    side: "left" | "right"
}

export default function DividerDecoration({ side }: DividerDecorationProps) {
    const isLeft = side === "left"
    return (
        <>
            <div
                aria-hidden
                className={cn(
                    "absolute top-1/2 w-16 border-t-2 border-dashed border-white transform -translate-y-px",
                    isLeft ? "left-4 skew-8 -rotate-8" : "right-4 -skew-8 rotate-8"
                )}
            />
            <div
                aria-hidden
                className={cn(
                    "absolute top-1/2 w-4 border-t-2 border-dotted border-white transform -translate-y-px",
                    isLeft ? "left-0 skew-8 -rotate-8" : "right-0 -skew-8 rotate-8"
                )}
            />
        </>
    )
}