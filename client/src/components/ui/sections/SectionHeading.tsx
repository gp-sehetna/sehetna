import { cn } from "@/lib/utils"
import Divider from "@/components/ui/GlobalControls/Divider"

type SectionHeadingProps = {
    label: string
    title: string
    subtitle?: string
    labelClassName?: string
    titleClassName?: string
    subtitleClassName?: string
    className?: string
}

export default function SectionHeading({
    label,
    title,
    subtitle,
    labelClassName,
    titleClassName,
    subtitleClassName,
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn("mx-auto max-w-2xl text-center", className)}>
            <Divider hideDecorations>
                <span className={cn("text-xs font-semibold tracking-widest uppercase", labelClassName)}>
                    {label}
                </span>
            </Divider>
            <h2 className={cn("mt-4 text-4xl lg:text-5xl", titleClassName)}>{title}</h2>
            {subtitle ? (
                <p className={cn("mt-4 text-base leading-relaxed text-neutral-800", subtitleClassName)}>
                    {subtitle}
                </p>
            ) : null}
        </div>
    )
}
