"use client"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

type ScrollEffectProp = {
    children?: React.ReactNode
}

const SCROLL_THRESHOLD = 8

function ScrollEffect({ children }: ScrollEffectProp) {
    const [hasScrolled, setHasScrolled] = useState(false)
    const pathname = usePathname()
    const isHomePage = pathname === "/"
    const isScrolled = !isHomePage || hasScrolled

    useEffect(() => {
        if (!isHomePage) return

        const handleScroll = () => setHasScrolled(window.scrollY > SCROLL_THRESHOLD)

        const frame = requestAnimationFrame(handleScroll)
        window.addEventListener("scroll", handleScroll)

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [isHomePage])
    return (
        <div
            className={cn(
                "relative flex items-center justify-between px-4 py-3",
                !isScrolled
                    ? "text-background border-transparent bg-transparent"
                    : "text-neutral-1000 glassy border-0 border-b border-b-neutral-200/40"
            )}
        >
            {children}
        </div>
    )
}

export default ScrollEffect
