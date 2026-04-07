import Divider from "@/components/ui/GlobalControls/Divider"
import { cn } from "@/lib/utils"

type SectionEyebrowProps = {
    label: string
    className?: string
    align?: "left" | "center"
}

export default function SectionEyebrow({ label, className, align = "left" }: SectionEyebrowProps) {
    return (
        <Divider
            hideDecorations
            className={cn(
                "max-w-fit",
                align === "center" ? "mx-auto justify-center" : "justify-start",
                className
            )}
        >
            <span className="text-xs font-semibold tracking-widest uppercase">{label}</span>
        </Divider>
    )
}
