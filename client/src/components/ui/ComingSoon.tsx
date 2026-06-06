import { ComingSoonBadge } from "@/components/ui/ComingSoonBadge"
import { cn } from "@/lib/utils"
import Image from "next/image"

type ComingSoonProps = {
    title: string
    description?: string
    isCompact?: boolean
    isSection?: boolean
    className?: string
}

export default function ComingSoon({
    className,
    title,
    description,
    isCompact = false,
    isSection = false,
}: ComingSoonProps) {
    return (
        <div
            className={cn("mx-auto max-w-4xl", !isCompact ? "px-6 py-24" : "px-2 py-6", className)}
        >
            <div className="mt-20 text-center">
                {/* Coming Soon Badge */}

                {!isCompact && <ComingSoonBadge />}
                {/* Page Title */}
                <h1 className={cn("bg-clip-text font-bold", "mb-4 text-5xl")}>
                    {title} {isSection ? "Section" : "Page"}
                </h1>

                {/* Description */}
                {description && (
                    <p className={cn("mbtext-xl text-gray-600", "mb-12")}>{description}</p>
                )}

                {/* Progress Illustration */}
                <div className="mx-auto max-w-md">
                    <Image
                        className="mx-auto pr-10"
                        src="/images/undraw_progress-tracking_9m3o.svg"
                        alt="Coming Soon"
                        width={200}
                        height={200}
                    />
                    <p className="text-neutral-1000 mt-4 text-xs">
                        Building something great for your health
                    </p>
                </div>
            </div>
        </div>
    )
}
