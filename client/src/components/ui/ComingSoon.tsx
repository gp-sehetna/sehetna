import { ComingSoonBadge } from "@/components/ui/ComingSoonBadge"
import { cn } from "@/lib/utils"

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
            <div className="text-center">
                {/* App Branding */}
                <div
                    className={cn(
                        "flex items-center justify-center gap-2",
                        !isCompact ? "mb-8" : "mb-4"
                    )}
                >
                    <h3 className="text-primary text-2xl font-bold">Sehetna</h3>
                </div>

                {/* Page Title */}
                <h1
                    className={cn(
                        "bg-clip-text font-bold",
                        !isCompact ? "mb-4 text-5xl" : "mb-8 text-3xl!"
                    )}
                >
                    {title} {isSection ? "Section" : "Page"}
                </h1>

                {/* Description */}
                {description && (
                    <p className={cn("mbtext-xl text-gray-600", !isCompact ? "mb-24" : "mb-12")}>
                        {description}
                    </p>
                )}

                {/* Coming Soon Badge */}
                {!isCompact && <ComingSoonBadge />}

                {/* Message */}
                <p className={cn("text-base text-gray-500", !isCompact ? "mb-12" : "mb-6")}>
                    We are working hard to bring you this feature. It will be available soon!
                </p>

                {/* Progress Illustration */}
                <div className="mx-auto max-w-md">
                    <svg
                        className={cn(
                            "text-primary-500 mx-auto",
                            !isCompact ? "h-32 w-32" : "h-16 w-16"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                    </svg>
                    <p className="mt-4 text-sm text-gray-600">
                        Building something great for your health
                    </p>
                </div>
            </div>
        </div>
    )
}
