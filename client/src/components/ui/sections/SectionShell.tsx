import { cn } from "@/lib/utils"
import Texture, { TexturesType } from "@/components/ui/textures"
import type { ReactNode } from "react"

type SectionShellProps = {
    children: ReactNode
    className?: string
    containerClassName?: string
    texture?: TexturesType
    decoration?: ReactNode
}

export default function SectionShell({
    children,
    className,
    containerClassName,
    texture,
    decoration,
}: SectionShellProps) {
    return (
        <section className={cn("bg-background relative overflow-hidden py-12 lg:py-24", className)}>
            {texture ? <Texture texture={texture} /> : null}
            {decoration}
            <div
                className={cn(
                    "relative mx-auto flex max-w-7xl flex-col gap-12",
                    containerClassName
                )}
            >
                {children}
            </div>
        </section>
    )
}
