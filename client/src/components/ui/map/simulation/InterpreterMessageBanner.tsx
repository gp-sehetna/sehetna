"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type InterpreterMessageBannerProps = {
    loading: boolean
    message: string
}

export const InterpreterMessageBanner = ({
    loading,
    message,
}: InterpreterMessageBannerProps) => {
    const [open, setOpen] = useState(false)

    if (!loading && !message) return null

    return (
        <div
            className="mx-6 my-2 overflow-hidden rounded-[10px] border"
            style={{
                background: "var(--color-primary-50)",
                borderColor: "var(--color-primary-200)",
                borderLeftWidth: "3px",
                borderLeftColor: "var(--color-primary-400)",
            }}
        >
            {/* Trigger row */}
            <button
                onClick={() => !loading && setOpen((o) => !o)}
                disabled={loading}
                className={cn(
                    "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left cursor-pointer transition-colors",
                    !loading && "hover:bg-primary-100",
                    loading && "cursor-default"
                )}
            >
                {/* Brain icon */}
                <svg
                    width="16" height="16"
                    viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-primary-500)"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    className="shrink-0"
                >
                    <path d="M9.5 2a2.5 2.5 0 0 1 5 0" />
                    <path d="M12 4.5C8.5 4.5 5 7 5 11c0 2 .8 3.5 2 4.5-.5 1-.5 2 0 3h10c.5-1 .5-2 0-3 1.2-1 2-2.5 2-4.5 0-4-3.5-6.5-7-6.5z" />
                    <path d="M8 11h8M10 14h4" />
                </svg>

                <div className="flex flex-1 items-center gap-2 min-w-0">
                    <span
                        className="shrink-0 text-[13px] font-medium"
                        style={{ color: "var(--color-primary-700)" }}
                    >
                        {loading ? "Analysing simulation" : "Simulation insight"}
                    </span>

                    {loading ? (
                        /* Thinking indicator */
                        <div className="flex items-center gap-2">
                            {/* Pulse dot */}
                            <span
                                className="block h-2 w-2 shrink-0 rounded-full"
                                style={{
                                    background: "var(--color-primary-400)",
                                    animation: "ip-pulse 1.4s ease-in-out infinite",
                                }}
                            />
                            {/* Sound-wave bars */}
                            <div className="flex items-center gap-0.75">
                                {[8, 14, 10, 16, 8, 12, 6].map((h, i) => (
                                    <span
                                        key={i}
                                        className="block w-0.75 rounded-sm"
                                        style={{
                                            height: `${h}px`,
                                            background: "var(--color-primary-400)",
                                            animation: "ip-wave 1s ease-in-out infinite",
                                            animationDelay: `${i * 0.08}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Collapsed preview */
                        !open && (
                            <span
                                className="truncate text-[12px]"
                                style={{ color: "var(--color-primary-500)" }}
                            >
                                {message}
                            </span>
                        )
                    )}
                </div>

                {!loading && (
                    <ChevronDown
                        size={14}
                        className={cn(
                            "shrink-0 transition-transform duration-250",
                            open && "rotate-180"
                        )}
                        style={{ color: "var(--color-primary-500)" }}
                    />
                )}
            </button>

            {/* Expandable body */}
            {!loading && (
                <div
                    className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                >
                    <div className="overflow-hidden">
                        <div
                            className="border-t px-3.5 pb-3 pt-2.5 text-[13px] leading-relaxed"
                            style={{
                                borderColor: "var(--color-primary-200)",
                                color: "var(--color-primary-700)",
                            }}
                        >
                            {message}
                        </div>
                    </div>
                </div>
            )}

            {/* Keyframe injection */}
            <style>{`
                @keyframes ip-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.6); }
                }
                @keyframes ip-wave {
                    0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
                    50% { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    )
}