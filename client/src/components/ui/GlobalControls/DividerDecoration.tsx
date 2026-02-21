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
                    "border-background absolute top-1/2 w-16 -translate-y-0.5 transform border-2 border-dashed",
                    isLeft ? "left-4 -rotate-8 skew-8" : "right-4 rotate-8 -skew-8"
                )}
            />
            <div
                aria-hidden
                className={cn(
                    "border-background absolute top-1/2 w-4 -translate-y-0.5 transform border-2 border-dotted",
                    isLeft ? "left-0 -rotate-8 skew-8" : "right-0 rotate-8 -skew-8"
                )}
            />
        </>
    )
}
